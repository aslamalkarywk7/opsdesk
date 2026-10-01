// Generic pagination helper. Clamps bad input (NaN, negatives) to page 1 and
// caps limit at 50 to protect DB/APIs. Returns { rows, total, page, limit,
// totalPages }. Callers: dashboard (limit 4), showcase/[id] (limit 4),
// GET /api/appointments (default 10).
export function paginate<T>(rows: T[], page: number, limit: number) {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(Math.floor(limit), 50) : 10;
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const current = Math.min(safePage, totalPages);
  const start = (current - 1) * safeLimit;
  return { rows: rows.slice(start, start + safeLimit), total, page: current, limit: safeLimit, totalPages };
}
