# `tests/smoke.mjs`

> Live-server smoke: 25 checks against a running instance.

## What it does

- Covers Auth.js login, RBAC matrix, pagination, validation contracts, gallery + workspace interactivity, metrics.
- Needs: built + started server, `AUTH_SECRET`, `DEMO_PASSWORD`, optional `BASE_URL`.
- Run: `npm run smoke` (CI starts `npm start` first).

## Links

- Source: `../../tests/smoke.mjs`
- Unit: [tests-domain-test.md](tests-domain-test.md)
- E2E: [tests-e2e-roles-spec.md](tests-e2e-roles-spec.md)
- CI: `../../.github/workflows/ci.yml`
- Index: [FILES](../FILES.md)
