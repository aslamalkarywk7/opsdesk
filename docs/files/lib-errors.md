# `lib/errors.ts`

> Structured server-side error reporting.

## What it does

- `reportError(scope, err, extra)`: JSON log line + audit entry + metrics tick.
- Returns an `ERR-xxx` id for tracing; audit failures are swallowed by design.

## Key behavior

- Called directly by server code; the client boundary posts to `/api/errors`.
- Production: forward to Sentry inside `reportError` (one-line change).

## Links

- Source: `../../lib/errors.ts`
- Beacon: [app-api-errors-route.md](app-api-errors-route.md)
- Boundary: [app-error.md](app-error.md)
- Index: [FILES](../FILES.md)
