# `lib/db.ts`

> Lazy Prisma singleton, or `null` in demo mode.

## What it does

- `getDb()`: returns `null` without `DATABASE_URL`, else a shared `PrismaClient`.
- Lets every route run on Vercel demo with zero config.

## Key behavior

- Node runtime only - never import from `middleware.ts`.
- Production: set Neon `DATABASE_URL`, run `db:push` + `db:seed`.

## Links

- Source: `../../lib/db.ts`
- Schema: `../../prisma/schema.prisma`
- Guide: [DATABASE](../DATABASE.md), [DEPLOYMENT](../DEPLOYMENT.md)
- Index: [FILES](../FILES.md)
