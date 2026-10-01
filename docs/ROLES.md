# Roles & Access Control

Three demo accounts, three different dashboards. Every screenshot below is captured from the live server (`public/screenshots/`). Same matrix as [docs/API.md](API.md). Enforcement code: [middleware.ts](../middleware.ts), [auth.config.ts](../auth.config.ts), [auth.ts](../auth.ts).

| | STAFF `staff@opsdesk.demo` | MANAGER `manager@opsdesk.demo` | ADMIN `admin@opsdesk.demo` |
|---|---|---|---|
| Dashboard view | Check-in queue only | Full stats + approvals + stock | Everything + audit preview |
| Check in (scheduled->checked_in) | yes | yes | yes |
| Complete / cancel | no (403) | yes | yes |
| Stats cards, approvals, stock | no | yes | yes |
| /team, /api/audit, metrics | no (redirect/403) | no (redirect/403) | yes |

Demo password for all three: `opsdesk123` (override via `DEMO_PASSWORD`). Production has no default: set `DEMO_PASSWORD` explicitly or demo login is disabled and only Postgres users can sign in.

## Screenshots

- `login.png` - sign-in with one-click demo accounts per role
- `dashboard-staff.png` - "My tasks" with check-in queue, single Check in button per row
- `dashboard-manager.png` - stats, three action buttons, pending approvals, low-stock alerts
- `dashboard-admin.png` - same as manager plus Latest audit panel and Open team & audit
- `team-admin.png` - users & roles table, request metrics, full audit trail

## How it is enforced

1. `POST /api/auth/callback/credentials` signs a JWT session (Auth.js, Edge-compatible) into an HttpOnly cookie. Demo password `opsdesk123`; production users verified by bcrypt against Postgres.
2. `middleware.ts` (Edge, via `auth.config.ts`) verifies the session on `/dashboard/:path*` (any role) and `/team/:path*` + `/api/audit*` (ADMIN only), plus per-instance rate limiting on matched POST APIs and `x-request-id` tracing. Matcher also covers `/api/appointments` + `/api/appointments/status` for rate limiting (auth itself is re-checked inside the status handler).
3. `POST /api/appointments/status` validates against `TRANSITIONS` in `lib/schemas.ts`, then applies the STAFF rule (only `scheduled -> checked_in`). Every mutation calls `audit()`.
4. `GET /api/audit` returns 403 for non-admin. `lib/db.ts` persists to Postgres when `DATABASE_URL` exists, otherwise demo memory store.

Production upgrades: database sessions with revocation, Upstash Redis rate limit, Prisma-backed audit log as primary store.
