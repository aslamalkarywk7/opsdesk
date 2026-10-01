# `lib/paginate.ts`

> Generic pagination with input clamping.

## What it does

- `paginate(rows, page, limit)`: sanitizes NaN/negatives to page 1, caps limit at 50.
- Returns `{ rows, total, page, limit, totalPages }` for tables + APIs.

## Key behavior

- Dashboard + showcase use limit 4; `GET /api/appointments` defaults to 10.

## Links

- Source: `../../lib/paginate.ts`
- Route: [app-api-appointments-route.md](app-api-appointments-route.md)
- Index: [FILES](../FILES.md)
