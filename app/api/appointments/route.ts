// GET: list/search/paginate appointments (DB when DATABASE_URL set, else demo).
// Query: q (patient/doctor/id substring), page, limit (see lib/paginate.ts).
// Responds { data, total, page, limit, totalPages, source: "db" | "demo" }.
// POST: persistent create (JSON or HTML form). 400 = unparsable body,
// 422 = Zod validation failed, 409 = duplicate id, 201 = created + stored.
// Writes go to Postgres when available, else to the demo memory store, and the
// mutation is audited. Reads/writes share lib/appointments.ts so the dashboard
// shows what the API stored. See docs/API.md.
import { NextResponse } from "next/server";
import { AppointmentSchema } from "@/lib/schemas";
import { paginate } from "@/lib/paginate";
import { audit } from "@/lib/audit";
import { count } from "@/lib/metrics";
import { listAppointments, createAppointment } from "@/lib/appointments";

export async function GET(request: Request) {
  count("GET /api/appointments");
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "10");

  // Single DB read: rows feed both the list and the source flag (avoids 2x query).
  const { rows: source, source: sourceName } = await listAppointments();
  const filtered = q
    ? source.filter(
        (a) =>
          a.patient.toLowerCase().includes(q) ||
          a.doctor.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
      )
    : source;
  const result = paginate(filtered, page, limit);
  return NextResponse.json({ data: result.rows, ...result, source: sourceName }, { status: 200 });
}

export async function POST(request: Request) {
  count("POST /api/appointments");
  let body: unknown;
  try {
    const ct = request.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) body = await request.json();
    else {
      const form = await request.formData();
      body = {
        id: `A-${Date.now().toString(36).toUpperCase()}`,
        patient: String(form.get("patient") ?? ""),
        doctor: "Dr. Hany",
        date: String(form.get("date") ?? ""),
        time: String(form.get("time") ?? ""),
        status: "scheduled"
      };
    }
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = AppointmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }
  // Auth.js v5 session cookie is `authjs.session-token` (secure variant in prod).
  const actor = request.headers.get("cookie")?.includes("authjs.session-token") ? "session-user" : "anonymous";
  try {
    const { row, source } = await createAppointment(parsed.data);
    audit({ actor, action: "create", entity: "appointment", entityId: row.id });
    return NextResponse.json({ data: row, source, message: "Created" }, { status: 201 });
  } catch (e) {
    // Prisma P2002: publicId already exists.
    if (e instanceof Error && "code" in e && (e as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Duplicate appointment id" }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not store appointment" }, { status: 500 });
  }
}
