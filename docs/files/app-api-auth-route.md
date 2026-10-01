# `app/api/auth/[...nextauth]/route.ts`

> Auth.js endpoint: re-exports `GET`/`POST` handlers from `auth.ts`.

## What it does

- Serves `/api/auth/*`: session, CSRF, sign-out, credentials callback.
- All logic lives in `auth.ts`; this file is only the route binding.

## Links

- Source: `../../app/api/auth/[...nextauth]/route.ts`
- Auth: [auth.md](auth.md)
- Guide: [ROLES](../ROLES.md)
- Index: [FILES](../FILES.md)
