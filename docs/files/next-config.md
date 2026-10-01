# `next.config.mjs`

> Next.js flags + global security headers.

## What it does

- `reactStrictMode: true`, `poweredByHeader: false`.
- Headers on `/(.*)`: `nosniff`, `DENY` framing, strict referrer policy.
- API no-store caching is set separately in `vercel.json`.

## Links

- Source: `../../next.config.mjs`
- Guide: [SECURITY](../SECURITY.md), [ARCHITECTURE](../ARCHITECTURE.md)
- Index: [FILES](../FILES.md)
