# `app/api/errors/route.ts`

> Client error beacon. Always 202, never fails.

## What it does

- Accepts `{ scope (max 80), message (max 500) }`, forwards valid ones to `reportError()`.
- Invalid/unparsable bodies are ignored silently (beacon must not throw).

## Links

- Source: `../../app/api/errors/route.ts`
- Reporter: [lib-errors.md](lib-errors.md)
- Boundary: [app-error.md](app-error.md)
- Guide: [API](../API.md)
- Index: [FILES](../FILES.md)
