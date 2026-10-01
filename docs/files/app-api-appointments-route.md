# `app/api/appointments/route.ts`

> List/search/paginate appointments; persistent create.

## What it does

- GET `?q=&page=&limit=`: rows from `listAppointments()` (DB or demo). Responds `{ data, total, page, limit, totalPages, source }`.
- POST (JSON or form): 400 unparsable body, 422 Zod failure, 409 duplicate id, 201 created + stored (Postgres or demo memory) + audited.

## Key behavior

- Single DB read feeds both list and `source` flag.
- Session cookie checked is `authjs.session-token`.

## Links

- Source: `../../app/api/appointments/route.ts`
- Store: [lib-appointments.md](lib-appointments.md)
- Schemas: [lib-schemas.md](lib-schemas.md)
- Store: [lib-data.md](lib-data.md)
- Guide: [API](../API.md)
- Index: [FILES](../FILES.md)
