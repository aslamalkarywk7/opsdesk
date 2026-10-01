// Seed production database: `npm run db:push` then `npm run db:seed`.
// Requires DATABASE_URL. Safe to re-run: users upsert by email, appointments
// upsert by publicId, patients reused by name, seed audit row written once.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();
const PASSWORD = process.env.DEMO_PASSWORD ?? "opsdesk123";

async function main() {
  const hash = await bcrypt.hash(PASSWORD, 10);

  const users = [
    { email: "admin@opsdesk.demo", name: "Admin", role: "ADMIN" },
    { email: "manager@opsdesk.demo", name: "Manager", role: "MANAGER" },
    { email: "staff@opsdesk.demo", name: "Staff", role: "STAFF" }
  ];

  for (const u of users) {
    await db.user.upsert({
      where: { email: u.email },
      update: { password: hash, role: u.role },
      create: { ...u, password: hash, role: u.role }
    });
  }

  const admin = await db.user.findUniqueOrThrow({ where: { email: "admin@opsdesk.demo" } });

  const entries = [
    { publicId: "A-1041", name: "Mona Adel", doctor: "Dr. Hany", date: "2026-09-30T09:00:00Z", status: "scheduled" },
    { publicId: "A-1042", name: "Karim Samy", doctor: "Dr. Laila", date: "2026-09-30T09:30:00Z", status: "checked_in" },
    { publicId: "A-1043", name: "Sara Nabil", doctor: "Dr. Hany", date: "2026-09-30T10:00:00Z", status: "completed" },
    { publicId: "A-1044", name: "Omar Fathy", doctor: "Dr. Mazen", date: "2026-09-30T10:30:00Z", status: "scheduled" },
    { publicId: "A-1045", name: "Huda Ali", doctor: "Dr. Laila", date: "2026-09-30T11:00:00Z", status: "cancelled" },
    { publicId: "A-1046", name: "Peter Magdy", doctor: "Dr. Mazen", date: "2026-09-30T11:30:00Z", status: "scheduled" }
  ];

  for (const [i, e] of entries.entries()) {
    // Patient has no unique field: reuse by name, else create once.
    const patient =
      (await db.patient.findFirst({ where: { name: e.name } })) ??
      (await db.patient.create({ data: { name: e.name, phone: `+20-100-000-000${i}` } }));
    // publicId is unique: second run updates instead of throwing P2002.
    await db.appointment.upsert({
      where: { publicId: e.publicId },
      update: { patientId: patient.id, doctor: e.doctor, date: new Date(e.date), status: e.status },
      create: {
        publicId: e.publicId,
        patientId: patient.id,
        doctor: e.doctor,
        date: new Date(e.date),
        status: e.status
      }
    });
  }

  // Seed marker written once so re-runs stay clean.
  const marker = await db.auditLog.findFirst({ where: { action: "seed", entity: "database", entityId: "init" } });
  if (!marker) {
    await db.auditLog.create({
      data: { actorId: admin.id, action: "seed", entity: "database", entityId: "init" }
    });
  }
  console.log("Seed complete: 3 users (bcrypt), 6 patients, 6 appointments.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
