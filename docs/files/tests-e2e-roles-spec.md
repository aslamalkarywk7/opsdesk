# `tests/e2e/roles.spec.ts`

> Real-Chromium RBAC matrix: 5 flows (`npm run e2e`).

## What it does

- anon redirect, STAFF queue-only + search, MANAGER approvals + stock, ADMIN team access, STAFF team denial.
- Transitions covered by unit + smoke, not here. Needs running server + Playwright browsers.

## Links

- Source: `../../tests/e2e/roles.spec.ts`
- Runner: [playwright-config.md](playwright-config.md)
- Smoke: [tests-smoke.md](tests-smoke.md)
- Index: [FILES](../FILES.md)
