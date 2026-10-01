# `lib/audit.ts`

> In-memory audit trail (demo fallback for the Prisma AuditLog).

## What it does

- `audit(entry)` appends `{ at, actor, action, entity, entityId }`, capped at 500.
- `recentAudit(limit)` returns newest-first for `/team` + dashboard preview.

## Key behavior

- DB-backed trail lives in Prisma (`GET /api/audit` branches to it).
- Production goal: make Prisma the primary store.

## Links

- Source: `../../lib/audit.ts`
- Route: [app-api-audit-route.md](app-api-audit-route.md)
- Page: [app-team-page.md](app-team-page.md)
- Guide: [DATABASE](../DATABASE.md), [ROLES](../ROLES.md)
- Index: [FILES](../FILES.md)
