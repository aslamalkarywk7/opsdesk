# `app/api/stats/route.ts`

> Validated KPI snapshot for cards and monitors.

## What it does

- Self-validates the demo `stats` via `StatsSchema` (500 on contract break).
- Responds `{ data: { todayAppointments, lowStock, pendingOrders, revenueMonth } }`.

## Key behavior

- Demo-only store (no Prisma model for stats yet) - same numbers feed dashboard cards.

## Links

- Source: `../../app/api/stats/route.ts`
- Schemas: [lib-schemas.md](lib-schemas.md)
- Store: [lib-data.md](lib-data.md)
- Guide: [API](../API.md)
- Index: [FILES](../FILES.md)
