# `lib/data.ts`

> Demo in-memory store used when `DATABASE_URL` is missing.

## What it does

- Static KPIs (`stats`), 6 appointments, 7-item inventory.
- `filterAppointments(q)`, `setAppointmentStatus(id, status)`, `lowStockItems()`.

## Key behavior

- Shape differs from Prisma on purpose (flat rows, no Patient FK, extra inventory/stats).
- Dashboard/team pages always render this store; only API list/status/audit branch to DB.

## Links

- Source: `../../lib/data.ts`
- Schema: `../../prisma/schema.prisma`
- Guide: [DATABASE](../DATABASE.md)
- Index: [FILES](../FILES.md)
