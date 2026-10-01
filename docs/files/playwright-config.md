# `playwright.config.ts`

> E2E runner: Chromium-only tests in `tests/e2e`.

## What it does

- `baseURL` from `BASE_URL` (default `http://localhost:3000`).
- Sequential runs, no retries, `list` reporter, traces off.
- Needs a running server: `npm run build` + `npm start` first.

## Links

- Source: `../../playwright.config.ts`
- Spec: [tests-e2e-roles-spec.md](tests-e2e-roles-spec.md)
- CI: `../../.github/workflows/ci.yml`
- Index: [FILES](../FILES.md)
