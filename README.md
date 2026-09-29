# OpsDesk - Business Management SaaS

Vercel-native full-stack: Next.js 14 App Router + TypeScript strict + Tailwind + Auth.js v5 + Prisma + Zod + serverless API routes. Neon Postgres in production, demo memory store locally.

Live: deploy this folder to Vercel (framework preset Next.js). No database required for demo; production Prisma schema in `prisma/schema.prisma` targets Neon Postgres.

## Quick start

```bash
cd opsdesk
npm install
npm run dev     # http://localhost:3000
npm test        # node --test
npm run build   # production check (same as Vercel)
```

## Routes

- `/` - landing + 65-design banner
- `/login` - Auth.js credential sign-in per role
- `/dashboard` - role-aware dashboard with search, pagination, actions
- `/team` - ADMIN users, audit trail, metrics
- `/showcase` - 65-variant gallery with domain filter
- `/showcase/[id]` - live themed workspace (search, status filter, sort, pagination)
- `/api/health` - liveness probe (+ `db` flag)
- `/api/stats` - Zod-validated KPIs
- `/api/appointments?q=&page=&limit=` - list + `POST` create with validation
- `/api/appointments/status` - transitions + RBAC
- `/api/audit` - ADMIN trail - `/api/metrics` - counters - `/api/errors` - client beacon

## Professional docs

- `docs/ARCHITECTURE.md` - system design, data flow, Vercel mapping
- `docs/ROLES.md` - role dashboards, RBAC matrix, enforcement, screenshots
- `docs/DESIGNS.md` - 65-variant gallery, what it proves, CV bullet
- `docs/DESIGN-SKILLS.md` - design & layout skills, Q&A on dashboard diversity
- `docs/API.md` - endpoints, validation, errors
- `docs/DATABASE.md` - ERD + indexes + Prisma rollout
- `docs/SECURITY.md` - headers, RBAC plan, OWASP notes
- `docs/CODE-STYLE.md` - senior conventions used here
- `docs/DEPLOYMENT.md` - Vercel deploy steps + env vars
- `public/screenshots/` - 10 UI captures + `designs/` (all 65 variants across 9 pages) for CV

## Screenshots (in `public/screenshots/`)

- `desktop-home.png` - landing
- `desktop-dashboard.png` - dashboard with stats, table, create form
- `desktop-search.png` - live search (`?q=mona` -> 1 shown)
- `login.png` - sign-in with demo accounts per role
- `dashboard-staff.png` - STAFF check-in queue, Check in only
- `dashboard-manager.png` - MANAGER stats, approvals, stock alerts
- `dashboard-admin.png` - ADMIN full control + latest audit
- `team-admin.png` - ADMIN users, metrics, audit trail
- `showcase.png` - 65-variant design gallery
- `showcase-live.png` - live themed workspace (/showcase/d-2)
- `designs/` - all 65 captured: `all.png` + one page per domain (8 files)

## Verified quality gates

- `npm test` - 7/7 passing (money format, appointment filter, pagination, 65-gallery count, module sync, ranks, transitions)
- `npm run smoke` - 25 live-server checks: Auth.js login, RBAC matrix, pagination, validation contracts, gallery + live-design interactivity, metrics
- `npm run e2e` - 5/5 real Chromium flows: guards, per-role dashboards, search, team RBAC
- `npm run build` - Next.js 14.2.35 production build, 80 static pages incl. 65 live designs + Auth.js middleware, First Load ~96 kB
- API: `GET /api/stats` 200 with Zod contract, `POST /api/appointments` 422 on invalid body, `POST /api/appointments/status` enforces transitions + roles
- Auth: HMAC-signed cookie sessions, `/dashboard` guarded, `/team` + `/api/audit` ADMIN-only
- Lighthouse (landing): Accessibility 98, Best Practices 100, SEO 100

## Roles (demo accounts)

- `staff@opsdesk.demo` / STAFF - check-in queue + check-in only
- `manager@opsdesk.demo` / MANAGER - approvals, stock alerts, complete/cancel
- `admin@opsdesk.demo` / ADMIN - everything + `/team` users, audit trail, metrics

## CV bullets (English)

- Built responsive SaaS dashboard (Next.js, TypeScript, Tailwind) with serverless APIs, Zod validation, search and paginated tables.
- Designed production Prisma/Postgres schema with RBAC, audit log and indexes; documented rollout to Neon.
- Hardened for Vercel: security headers, no-store APIs, validated inputs, clean error contracts.
