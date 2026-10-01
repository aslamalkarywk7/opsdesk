# Database

Production target: Neon Postgres + Prisma. See `prisma/schema.prisma`.
Deploy: [docs/DEPLOYMENT.md](DEPLOYMENT.md) + [docs/DEPLOY-CHECKLIST.md](DEPLOY-CHECKLIST.md). APIs: [docs/API.md](API.md).

Entities: User (email unique, bcrypt password, ADMIN/MANAGER/STAFF) -> AuditLog + Account (Auth.js); Patient -> Appointment (publicId unique, status enum, date index).

Indexes: Patient.name, Appointment.date, Appointment.status, AuditLog(entity, entityId).

Rollout: set `DATABASE_URL` in Vercel env, run `npm run db:push` then `npm run db:seed` (3 users with hashed `DEMO_PASSWORD`, 6 patients, 6 appointments with stable publicIds, seed is safe to re-run). Routes auto-switch: `getDb()` returns the client when `DATABASE_URL` exists, otherwise demo memory store. `/api/health` reports `"db": true/false`, list endpoints report `"source": "db"/"demo"`.

Known demo gap: dashboard/team pages always render the in-memory store (`lib/data.ts`); only the API list/status/audit routes branch to Postgres. Inventory + KPIs have no Prisma models yet.
