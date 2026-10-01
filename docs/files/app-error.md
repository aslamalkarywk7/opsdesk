# `app/error.tsx`

> App error boundary: reports crashes, offers retry.

## What it does

- POSTs `{ scope: "app-boundary", message }` to `/api/errors` (fire-and-forget).
- Renders a retry button via `reset()`.

## Links

- Source: `../../app/error.tsx`
- Beacon: [app-api-errors-route.md](app-api-errors-route.md)
- Reporter: [lib-errors.md](lib-errors.md)
- Index: [FILES](../FILES.md)
