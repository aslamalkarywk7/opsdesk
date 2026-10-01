# `prisma/seed.mjs`

> Production seed: 3 users + 6 patients + 6 appointments (re-runnable).

## What it does

- Run after `npm run db:push`: `npm run db:seed` (needs `DATABASE_URL`).
- Users upsert by email (bcrypt of `DEMO_PASSWORD`); appointments upsert by `publicId`; patients reused by name; seed audit marker written once.

## Links

- Source: `../../prisma/seed.mjs`
- Schema: `../../prisma/schema.prisma`
- Guide: [DATABASE](../DATABASE.md), [DEPLOY-CHECKLIST](../DEPLOY-CHECKLIST.md)
- Index: [FILES](../FILES.md)
