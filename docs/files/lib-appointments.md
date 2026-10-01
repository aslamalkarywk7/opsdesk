# `lib/appointments.ts`

> Single source for appointment reads/writes (DB or demo).

## What it does

- `listAppointments()`: Postgres rows (mapped to demo shape) when `DATABASE_URL` set, else the demo array. Returns `{ rows, source }`.
- `createAppointment(input)`: persists to Postgres (find-or-create patient by name, unique `publicId`) or pushes to demo memory. Returns `{ row, source }`.
- DB errors fall back to demo instead of 500ing the page.

## Key behavior

- Dashboard + API list + status flow share this module, so UI shows what the API stored.
- Duplicate `publicId` throws P2002 (caller maps to 409).

## Links

- Source: `../../lib/appointments.ts`
- Store: [lib-data.md](lib-data.md)
- DB: [lib-db.md](lib-db.md)
- Routes: [app-api-appointments-route.md](app-api-appointments-route.md), [app-api-appointments-status-route.md](app-api-appointments-status-route.md)
- Page: [app-dashboard-page.md](app-dashboard-page.md)
- Guide: [DATABASE](../DATABASE.md)
- Index: [FILES](../FILES.md)
