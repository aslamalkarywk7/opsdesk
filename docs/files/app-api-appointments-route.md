# `app/api/appointments/route.ts`

> List/search/paginate appointments; validate-only create.

## What it does

- GET `?q=&page=&limit=`: DB rows when `DATABASE_URL` set, else demo store. Responds `{ data, total, page, limit, totalPages, source }`.
- POST (JSON or form, demo-open): 400 unparsable body, 422 Zod failure, 201 valid. Valid creates are NOT persisted (documented demo gap).

## Key behavior

- Single DB read feeds both list and `source` flag.
- Session cookie checked is `authjs.session-token`.

## Links

- Source: `../../app/api/appointments/route.ts`
- Schemas: [lib-schemas.md](lib-schemas.md)
- Store: [lib-data.md](lib-data.md)
- Guide: [API](../API.md)
- Index: [FILES](../FILES.md)
