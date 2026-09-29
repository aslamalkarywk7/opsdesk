# Code style (senior)

- Strict TypeScript, no `any` in app code; shared contracts in `lib/schemas.ts`.
- Route Handlers are thin: parse -> validate (Zod) -> respond. No business logic in JSX.
- Components are server-first; client JS only where needed.
- Naming: `kebab-case` files, `PascalCase` components, `camelCase` functions.
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`). Format with Prettier, lint with `next lint`.
