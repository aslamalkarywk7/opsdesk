# `lib/schemas.ts`

> Shared Zod contracts + appointment transition graph.

## What it does

- `AppointmentSchema` (create payload), `StatsSchema` (KPIs), `StatusChangeSchema` (`{id, status}`).
- `TRANSITIONS`: legal status moves; STAFF rule (`scheduled -> checked_in` only) enforced in the status route.

## Links

- Source: `../../lib/schemas.ts`
- Routes: [app-api-appointments-route.md](app-api-appointments-route.md), [app-api-appointments-status-route.md](app-api-appointments-status-route.md)
- Guide: [API](../API.md), [ROLES](../ROLES.md)
- Index: [FILES](../FILES.md)
