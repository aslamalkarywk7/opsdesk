# Code style (senior)

- Strict TypeScript, no `any` in app code; shared contracts in `lib/schemas.ts`.
- Route Handlers are thin: parse -> validate (Zod) -> respond. No business logic in JSX.
- Components are server-first; client JS only where needed (`/login`, error boundary).
- Naming: `kebab-case` files, `PascalCase` components, `camelCase` functions.
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`).
- Quality gates: `npm test` (offline unit), `npm run smoke` (live server), `npm run e2e` (Playwright), `npm run build` (`prisma generate && next build`). Every file carries a header comment explaining its purpose + links. See [.github/workflows/ci.yml](../.github/workflows/ci.yml).
- File map: [docs/FILES.md](FILES.md) - one short doc per code file (46).
