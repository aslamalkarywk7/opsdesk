// Single source for appointment reads/writes (server only, Node runtime).
// DB when DATABASE_URL is set (Neon Postgres), otherwise the demo memory store.
// Dashboard + API list + status flow all go through here, so the UI shows the
// same rows the API returns. Demo writes persist within the instance; DB writes
// persist in Postgres. See lib/data.ts (demo shape) + docs/DATABASE.md.
import { getDb } from "./db";
import { appointments } from "./data";
import type { Appointment } from "./schemas";

export type StoreSource = "db" | "demo";

function toAppointment(r: {
  publicId: string;
  doctor: string;
  date: Date;
  status: string;
  patient: { name: string };
}): Appointment {
  return {
    id: r.publicId,
    patient: r.patient.name,
    doctor: r.doctor,
    date: r.date.toISOString().slice(0, 10),
    time: r.date.toISOString().slice(11, 16),
    status: r.status as Appointment["status"]
  };
}

export async function listAppointments(): Promise<{ rows: Appointment[]; source: StoreSource }> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.appointment.findMany({
        include: { patient: true },
        orderBy: { date: "asc" }
      });
      return { rows: rows.map(toAppointment), source: "db" };
    } catch {
      // DB unreachable (cold start, network): fall through to demo store.
    }
  }
  return { rows: appointments, source: "demo" };
}

export async function createAppointment(input: Appointment): Promise<{ row: Appointment; source: StoreSource }> {
  const db = getDb();
  if (db) {
    let patient = await db.patient.findFirst({ where: { name: input.patient } });
    if (!patient) {
      patient = await db.patient.create({ data: { name: input.patient } });
    }
    // publicId is unique: duplicates throw P2002, handled by the caller as 409.
    await db.appointment.create({
      data: {
        publicId: input.id,
        patientId: patient.id,
        doctor: input.doctor,
        date: new Date(`${input.date}T${input.time}:00Z`),
        status: input.status
      }
    });
    return { row: input, source: "db" };
  }
  appointments.push(input);
  return { row: input, source: "demo" };
}
