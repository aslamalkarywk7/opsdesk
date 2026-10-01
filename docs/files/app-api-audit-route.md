# `app/api/audit/route.ts`

> ADMIN-only audit trail (DB or memory).

## What it does

- 401 anonymous, 403 non-ADMIN (mirrors `middleware.ts`).
- DB: last 50 `AuditLog` rows with actor email. Demo: `recentAudit(50)`.
- Responds `{ data, source }`.

## Links

- Source: `../../app/api/audit/route.ts`
- Trail: [lib-audit.md](lib-audit.md)
- Guards: [middleware.md](middleware.md)
- Guide: [API](../API.md), [ROLES](../ROLES.md)
- Index: [FILES](../FILES.md)
