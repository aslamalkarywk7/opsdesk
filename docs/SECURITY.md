# Security

Implemented: Auth.js v5 credential auth (bcrypt passwords in Postgres, demo fallback locally), JWT HttpOnly sessions, security headers in `next.config.mjs` (nosniff, DENY framing, strict referrer), server-side Zod validation, typed errors without stack leaks, no-store on APIs, middleware auth guard on `/dashboard` and ADMIN-only `/team` + `/api/audit`, per-instance POST rate limiting, `x-request-id` tracing, client error beacon `/api/errors` with audit + structured logs, strict appointment transition map with STAFF restriction, audit log on login and every status change. Full RBAC matrix in [docs/ROLES.md](ROLES.md). Endpoints in [docs/API.md](API.md). Data in [docs/DATABASE.md](DATABASE.md). Deploy in [docs/DEPLOYMENT.md](DEPLOYMENT.md).

Planned before real patients: Auth.js + database sessions, Upstash rate-limit, Prisma-backed audit log, OWASP review pass.
