# `app/api/metrics/route.ts`

> Uptime + per-route request counters.

## What it does

- Returns `{ service, version, uptimeSeconds, requests }` (version mirrors `package.json`).
- Public demo endpoint; the rendered `/team` view is ADMIN-only instead.

## Links

- Source: `../../app/api/metrics/route.ts`
- Counters: [lib-metrics.md](lib-metrics.md)
- Page: [app-team-page.md](app-team-page.md)
- Guide: [API](../API.md)
- Index: [FILES](../FILES.md)
