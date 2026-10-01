# `lib/metrics.ts`

> In-memory request counters (per serverless instance).

## What it does

- `count(route)` ticks a key; `snapshot()` returns `{ uptimeSeconds, requests }`.
- Surfaced at `GET /api/metrics` and the `/team` metrics panel.

## Key behavior

- Resets on cold start; production should export to Vercel Analytics.
- Every API route calls `count()` first.

## Links

- Source: `../../lib/metrics.ts`
- Route: [app-api-metrics-route.md](app-api-metrics-route.md)
- Page: [app-team-page.md](app-team-page.md)
- Guide: [ARCHITECTURE](../ARCHITECTURE.md)
- Index: [FILES](../FILES.md)
