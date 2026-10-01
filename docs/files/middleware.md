# `middleware.ts`

> Edge gate: session check, ADMIN fence, POST rate limit, request tracing.

## What it does

- `/dashboard/:path*`: any signed-in role, else redirect to `/login?next=...`.
- `/team/:path*` + `/api/audit*`: ADMIN only (pages redirect, APIs get 403 JSON).
- POST on matched `/api/*`: 20 req/min/IP memory limit (Upstash Redis in prod).
- Adds `x-request-id` to matched responses.

## Key behavior

- Matcher: `/dashboard/:path*`, `/team/:path*`, `/api/appointments`, `/api/appointments/status`, `/api/audit`.
- Built on Edge-safe `auth.config.ts`, never on `auth.ts`.

## Links

- Source: `../../middleware.ts`
- Config: [auth-config.md](auth-config.md)
- Routes: [app-api-audit-route.md](app-api-audit-route.md), [app-dashboard-page.md](app-dashboard-page.md), [app-team-page.md](app-team-page.md)
- Guide: [ROLES](../ROLES.md), [SECURITY](../SECURITY.md)
- Index: [FILES](../FILES.md)
