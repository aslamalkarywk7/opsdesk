# `auth.config.ts`

> Edge-safe Auth.js config shared by middleware and the Node auth instance.

## What it does

- Demo Credentials provider only (no Prisma, no bcrypt at top level).
- JWT session carries `role`; session callback exposes `id` + `role`.
- Module augmentation for `Session` / `User` / `JWT` role typing.

## Key behavior

- Safe to bundle on Vercel Edge (`middleware.ts` builds on it).
- `authorize()` accepts only `DEMO_USERS` + explicit `DEMO_PASSWORD` (dev-only fallback `opsdesk123`; production without it disables demo login).

## Links

- Source: `../../auth.config.ts`
- Node auth: [auth.md](auth.md)
- Guards: [middleware.md](middleware.md)
- Guide: [ROLES](../ROLES.md)
- Index: [FILES](../FILES.md)
