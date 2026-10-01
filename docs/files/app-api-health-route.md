# `app/api/health/route.ts`

> Liveness probe: always 200 when the server runs.

## What it does

- Returns `{ service, status, time, region, db }` (`db` = Neon reachable?).
- First URL to check after deploy (see DEPLOYMENT).

## Links

- Source: `../../app/api/health/route.ts`
- DB: [lib-db.md](lib-db.md)
- Guide: [API](../API.md), [DEPLOYMENT](../DEPLOYMENT.md)
- Index: [FILES](../FILES.md)
