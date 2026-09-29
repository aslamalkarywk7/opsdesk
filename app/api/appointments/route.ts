import { NextResponse } from "next/server";
import { appointments } from "@/lib/data";
import { AppointmentSchema } from "@/lib/schemas";
import { paginate } from "@/lib/paginate";
import { audit } from "@/lib/audit";
import { count } from "@/lib/metrics";
import { getDb } from "@/lib/db";

async function listFromDb() {
  const db = getDb();
  if (!db) return null;
  try {
    const rows = await db.appointment.findMany({
      include: { patient: true },
      orderBy: { date: "asc" }
    });
    return rows.map((r) => ({
      id: r.publicId,
      patient: r.patient.name,
      doctor: r.doctor,
      date: r.date.toISOString().slice(0, 10),
      time: r.date.toISOString().slice(11, 16),
      status: r.status as "scheduled" | "checked_in" | "completed" | "cancelled"
    }));
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  count("GET /api/appointments");
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "10");

  const source = (await listFromDb()) ?? appointments;
  const filtered = q
    ? source.filter(
        (a) =>
          a.patient.toLowerCase().includes(q) ||
          a.doctor.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
      )
    : source;
  const result = paginate(filtered, page, limit);
  return NextResponse.json({ data: result.rows, ...result, source: (await listFromDb()) ? "db" : "demo" }, { status: 200 });
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
        id: `A-${Date.now().toString().slice(-4)}`,
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
  const actor = request.headers.get("cookie")?.includes("opsdesk_session") ? "session-user" : "anonymous";
  audit({ actor, action: "create", entity: "appointment", entityId: parsed.data.id });
  return NextResponse.json({ data: parsed.data, message: "Created" }, { status: 201 });
}
