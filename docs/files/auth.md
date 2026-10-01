# `auth.ts`

> Full Auth.js instance for the Node runtime (pages + API routes).

## What it does

- Spreads `auth.config.ts`, then attaches `PrismaAdapter` when `DATABASE_URL` exists.
- `authorize()` checks Postgres via bcrypt first, falls back to demo users.
- Exports `handlers` (for `/api/auth/*`), `auth` (server session), `signIn`, `signOut`.

## Key behavior

- `secret`: `AUTH_SECRET` or `NEXTAUTH_SECRET`.
- Demo password default `opsdesk123` (override with `DEMO_PASSWORD`).
- Never import from `middleware.ts` (Edge crash) - Edge uses `auth.config.ts`.

## Links

- Source: `../../auth.ts`
- Edge config: [auth-config.md](auth-config.md)
- Guards: [middleware.md](middleware.md)
- Guide: [ROLES](../ROLES.md), [ARCHITECTURE](../ARCHITECTURE.md)
- Index: [FILES](../FILES.md)
