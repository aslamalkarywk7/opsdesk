# `app/team/page.tsx`

> ADMIN-only Team and audit page: users, metrics, full trail (DB or demo).

## What it does

- Guards: anonymous to `/login?next=/team`, non-ADMIN to `/dashboard` (mirrors middleware).
- Sections: users and roles table (Postgres users or demo directory), request metrics (per-instance memory), audit trail (Postgres or memory, 50) - each with a Live database / Demo data badge.

## Screenshot

![team](../../public/screenshots/team-admin.png)

## Links

- Source: `../../app/team/page.tsx`
- Users: [lib-demo-users.md](lib-demo-users.md)
- Trail: [lib-audit.md](lib-audit.md)
- Metrics: [lib-metrics.md](lib-metrics.md)
- Guide: [ROLES](../ROLES.md)
- Index: [FILES](../FILES.md)
