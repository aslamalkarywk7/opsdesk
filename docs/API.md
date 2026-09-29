# API

Base: same origin. All JSON, `Cache-Control: no-store` on `/api/*`.

- `GET /api/health` -> 200 `{ service, status, time, region }`
- `GET /api/stats` -> 200 `{ data: { todayAppointments, lowStock, pendingOrders, revenueMonth } }`, 500 on contract break
- `GET /api/appointments?q=&page=&limit=` -> 200 `{ data, total, page, limit, totalPages, source }`
- `POST /api/appointments` (JSON or form) -> 201 `{ data }`, 400 invalid body, 422 Zod issues
- `POST /api/appointments/status` (JSON or form) -> 200 or 303 for forms. Auth required. 401 anonymous, 403 STAFF outside check-in, 404 unknown id, 422 illegal transition
- `GET /api/audit` -> ADMIN only. 401 anonymous, 403 non-admin, 200 `{ data }`
- `POST /api/auth/callback/credentials` (Auth.js) - email + password, bcrypt in production, demo password locally
- `GET /api/auth/session|csrf|signout` - Auth.js session, CSRF, sign-out
- `POST /api/errors` - client error beacon (202), logged + audited
- `GET /api/metrics` -> uptime + per-route counters

Validation: `AppointmentSchema` (id, patient 2-80 chars, doctor, YYYY-MM-DD, HH:mm, status enum). Status changes follow `TRANSITIONS`; STAFF may only do `scheduled -> checked_in`. Errors return `{ error, issues? }`.

## RBAC matrix

| Capability | STAFF | MANAGER | ADMIN |
|---|---|---|---|
| Dashboard + check-in queue | yes | yes | yes |
| Check in (scheduled->checked_in) | yes | yes | yes |
| Complete / cancel | no (403) | yes | yes |
| Stats cards, approvals, stock | no | yes | yes |
| /team, /api/audit, metrics | no | no | yes |
