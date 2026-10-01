# Code files (47) - one doc per file

Every source file has a short doc explaining its job in the project.
Main guides: [ARCHITECTURE](ARCHITECTURE.md) - [API](API.md) - [ROLES](ROLES.md) - [DATABASE](DATABASE.md) - [SECURITY](SECURITY.md) - [CODE-STYLE](CODE-STYLE.md) - [DEPLOYMENT](DEPLOYMENT.md).

## Auth and middleware (3)

- [auth.ts](files/auth.md) - Node Auth.js instance (DB + demo)
- [auth.config.ts](files/auth-config.md) - Edge-safe auth config
- [middleware.ts](files/middleware.md) - session gate, ADMIN fence, rate limit

## Config (5)

- [next.config.mjs](files/next-config.md) - flags + security headers
- [tailwind.config.ts](files/tailwind-config.md) - brand/ink tokens
- [postcss.config.mjs](files/postcss-config.md) - CSS pipeline
- [playwright.config.ts](files/playwright-config.md) - E2E runner
- [next-env.d.ts](files/next-env-d-ts.md) - auto-generated types

## Library (11)

- [lib/schemas.ts](files/lib-schemas.md) - Zod contracts + transitions
- [lib/data.ts](files/lib-data.md) - demo in-memory store
- [lib/db.ts](files/lib-db.md) - lazy Prisma singleton
- [lib/appointments.ts](files/lib-appointments.md) - appointment reads/writes (DB or demo)
- [lib/audit.ts](files/lib-audit.md) - memory audit trail
- [lib/metrics.ts](files/lib-metrics.md) - request counters
- [lib/errors.ts](files/lib-errors.md) - structured error reporting
- [lib/auth-roles.ts](files/lib-auth-roles.md) - Role model + ranks
- [lib/demo-users.ts](files/lib-demo-users.md) - display user directory
- [lib/designs.ts](files/lib-designs.md) - 65-variant gallery engine
- [lib/paginate.ts](files/lib-paginate.md) - pagination helper
- [lib/format.ts](files/lib-format.md) - money formatting

## Components (5)

- [Topbar.tsx](files/components-topbar.md) - site header + nav
- [RoleBanner.tsx](files/components-role-banner.md) - identity + role pill
- [StatCard.tsx](files/components-stat-card.md) - KPI card
- [StatusBadge.tsx](files/components-status-badge.md) - status pill
- [DesignPreview.tsx](files/components-design-preview.md) - gallery miniature

## API routes (8)

- [appointments/route.ts](files/app-api-appointments-route.md) - list + validate-only create
- [appointments/status/route.ts](files/app-api-appointments-status-route.md) - transitions + RBAC
- [audit/route.ts](files/app-api-audit-route.md) - ADMIN trail
- [auth/[...nextauth]/route.ts](files/app-api-auth-route.md) - Auth.js handlers
- [health/route.ts](files/app-api-health-route.md) - liveness + db flag
- [stats/route.ts](files/app-api-stats-route.md) - validated KPIs
- [metrics/route.ts](files/app-api-metrics-route.md) - uptime + counters
- [errors/route.ts](files/app-api-errors-route.md) - client error beacon

## Pages (10)

- [app/layout.tsx](files/app-layout.md) - root shell + metadata
- [app/page.tsx](files/app-page.md) - public landing
- [app/dashboard/page.tsx](files/app-dashboard-page.md) - role dashboard
- [app/login/page.tsx](files/app-login-page.md) - sign-in + demo picker
- [app/team/page.tsx](files/app-team-page.md) - ADMIN team + audit
- [app/showcase/page.tsx](files/app-showcase-page.md) - 65-variant gallery
- [app/showcase/[id]/page.tsx](files/app-showcase-id-page.md) - live workspace
- [app/error.tsx](files/app-error.md) - error boundary + beacon
- [app/not-found.tsx](files/app-not-found.md) - 404 page
- [app/globals.css](files/app-globals-css.md) - shared utilities

## Data and tests (4)

- [prisma/seed.mjs](files/prisma-seed.md) - production seed (re-runnable)
- [tests/domain.test.mjs](files/tests-domain-test.md) - offline unit 7/7
- [tests/smoke.mjs](files/tests-smoke.md) - live smoke 25 checks
- [tests/e2e/roles.spec.ts](files/tests-e2e-roles-spec.md) - Chromium RBAC 5 flows

Schema `prisma/schema.prisma` is documented in [DATABASE](DATABASE.md).
