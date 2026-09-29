import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { audit } from "@/lib/audit";
import { count } from "@/lib/metrics";
import { setAppointmentStatus, appointments } from "@/lib/data";
import { getDb } from "@/lib/db";
import { StatusChangeSchema, TRANSITIONS } from "@/lib/schemas";

// POST /api/appointments/status { id, status }
// STAFF: only scheduled -> checked_in. MANAGER/ADMIN: any valid transition.
// Persists to Postgres when DATABASE_URL is set, otherwise demo memory store.
// HTML forms get a 303 redirect back to /dashboard; JSON callers get 200 JSON.
export async function POST(request: Request) {
  count("POST /api/appointments/status");
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = session.user.role;
  const actor = session.user.email ?? "unknown";

  const ct = request.headers.get("content-type") ?? "";
  const isForm = !ct.includes("application/json");
  let raw: unknown;
  try {
    if (isForm) {
      const form = await request.formData();
      raw = { id: String(form.get("id") ?? ""), status: String(form.get("status") ?? "") };
    } else {
      raw = await request.json();
    }
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = StatusChangeSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 422 });
  }

  const db = getDb();
  if (db) {
    try {
      const row = await db.appointment.findUnique({
        where: { publicId: parsed.data.id },
        include: { patient: true }
      });
      if (!row) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
      if (!TRANSITIONS[row.status].includes(parsed.data.status)) {
        return NextResponse.json(
          { error: `Illegal transition ${row.status} -> ${parsed.data.status}` },
          { status: 422 }
        );
      }
      if (role === "STAFF" && !(row.status === "scheduled" && parsed.data.status === "checked_in")) {
        return NextResponse.json({ error: "Forbidden for role STAFF" }, { status: 403 });
      }
      const updated = await db.appointment.update({
        where: { publicId: parsed.data.id },
        data: { status: parsed.data.status }
      });
      const me = await db.user.findUnique({ where: { email: actor } });
      await db.auditLog.create({
        data: {
          actorId: me?.id,
          action: `appointment:${parsed.data.status}`,
          entity: "appointment",
          entityId: parsed.data.id
        }
      });
      if (isForm) return new NextResponse(null, { status: 303, headers: { Location: "/dashboard" } });
      return NextResponse.json({ data: { ...parsed.data, date: updated.date }, source: "db" }, { status: 200 });
    } catch {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  const current = appointments.find((a) => a.id === parsed.data.id);
  if (!current) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  if (!TRANSITIONS[current.status].includes(parsed.data.status)) {
    return NextResponse.json(
      { error: `Illegal transition ${current.status} -> ${parsed.data.status}` },
      { status: 422 }
    );
  }
  if (role === "STAFF" && !(current.status === "scheduled" && parsed.data.status === "checked_in")) {
    return NextResponse.json({ error: "Forbidden for role STAFF" }, { status: 403 });
  }

  const updated = setAppointmentStatus(parsed.data.id, parsed.data.status);
  audit({ actor, action: `appointment:${parsed.data.status}`, entity: "appointment", entityId: parsed.data.id });
  if (isForm) {
    return new NextResponse(null, { status: 303, headers: { Location: "/dashboard" } });
  }
  return NextResponse.json({ data: updated, source: "demo" }, { status: 200 });
}
