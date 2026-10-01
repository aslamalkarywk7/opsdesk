// In-memory audit trail (demo fallback). audit() appends { at, actor, action,
// entity, entityId } capped at 500 entries (oldest dropped). recentAudit()
// returns newest-first. DB-backed trail lives in Prisma AuditLog (see
// GET /api/audit + docs/DATABASE.md). Production: make Prisma the primary store.
export interface AuditEntry {
  at: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
}

const log: AuditEntry[] = [];

export function audit(entry: Omit<AuditEntry, "at">): AuditEntry {
  const full = { ...entry, at: new Date().toISOString() };
  log.push(full);
  if (log.length > 500) log.splice(0, log.length - 500);
  return full;
}

export function recentAudit(limit = 50): AuditEntry[] {
  return log.slice(-limit).reverse();
}
