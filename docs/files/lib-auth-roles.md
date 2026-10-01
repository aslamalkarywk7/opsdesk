# `lib/auth-roles.ts`

> Role model + rank comparison helper.

## What it does

- `Role` type: `ADMIN` | `MANAGER` | `STAFF`.
- `RANK`: STAFF 1, MANAGER 2, ADMIN 3; `hasRole(user, minimum)` compares ranks.
- `SessionUser` interface for banner/team display.

## Key behavior

- Most code uses direct `role ===` checks; prefer `hasRole()` for new gates.
- JWT role flows via `auth.config.ts` callbacks.

## Links

- Source: `../../lib/auth-roles.ts`
- Banner: [components-role-banner.md](components-role-banner.md)
- Guide: [ROLES](../ROLES.md)
- Index: [FILES](../FILES.md)
