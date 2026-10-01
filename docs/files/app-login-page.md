# `app/login/page.tsx`

> Sign-in form + one-click demo accounts (client component).

## What it does

- Email/password form using Auth.js `signIn("credentials")` redirect flow.
- Demo picker fills `staff/manager/admin@opsdesk.demo` (password `opsdesk123`).
- `?next=` sets the post-login target (default `/dashboard`).

## Screenshot

![login](../../public/screenshots/login.png)

## Links

- Source: `../../app/login/page.tsx`
- Auth: [auth.md](auth.md)
- Guide: [ROLES](../ROLES.md)
- Index: [FILES](../FILES.md)
