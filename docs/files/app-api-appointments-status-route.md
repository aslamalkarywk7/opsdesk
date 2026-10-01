# `app/api/appointments/status/route.ts`

> Authenticated status transitions with RBAC (DB or demo).

## What it does

- Requires session (401 anonymous). Validates `{ id, status }` via Zod.
- Enforces `TRANSITIONS` + STAFF rule (`scheduled -> checked_in` only, else 403).
- 404 unknown id, 422 illegal move, 200 JSON (or 303 to `/dashboard` for forms).
- Persists to Postgres when available, else demo memory; writes an audit entry.

## Links

- Source: `../../app/api/appointments/status/route.ts`
- Schemas: [lib-schemas.md](lib-schemas.md)
- Guide: [API](../API.md), [ROLES](../ROLES.md)
- Index: [FILES](../FILES.md)
