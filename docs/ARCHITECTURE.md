# Architecture

Single Vercel project (serverless). No separate backend server to operate.

```
Browser -> Vercel Edge (headers) -> Next.js App Router
  / (SSG landing) | /login (Auth.js credentials) | /dashboard (SSR, role-aware) | /team (ADMIN only)
  /showcase (public gallery, domain filter) | /showcase/[id] (65 static paths, interactive q/status/sort/dir/page)
  /api/health | /api/stats | /api/appointments (+ /status) | /api/auth/* (Auth.js) | /api/audit (ADMIN) | /api/metrics | /api/errors
Middleware (Auth.js): session verify (JWT) -> /dashboard any role, /team + /api/audit ADMIN, POST rate-limit, x-request-id
Lib: lib/schemas.ts (Zod contracts incl. TRANSITIONS) + auth.ts (Auth.js, bcrypt, RBAC) + lib/data.ts (demo store -> Prisma) + lib/designs.ts (65 theme tokens)
DB (production): Neon Postgres via Prisma (`npm run db:push` + `npm run db:seed`); Redis (Upstash) for rate-limit/queue later
```

Why this fits Vercel: one `next build` output (80 static pages incl. 65 designs), API routes scale to zero, `vercel.json` pins region and disables API caching. NestJS was rejected here because it needs a long-lived Node server (better on Render/Fly).

Evolution path: point `DATABASE_URL` at Neon for live data; move heavy jobs to Upstash QStash; forward `reportError()` to Sentry.
