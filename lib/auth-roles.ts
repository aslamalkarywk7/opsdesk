// Role model: STAFF (1) < MANAGER (2) < ADMIN (3). hasRole() compares ranks.
// Note: most code uses direct `role ===` checks; hasRole() is currently only
// mirrored in tests. Prefer it for new minimum-role checks. See docs/ROLES.md.
export type Role = "ADMIN" | "MANAGER" | "STAFF";

const RANK: Record<Role, number> = { STAFF: 1, MANAGER: 2, ADMIN: 3 };

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export function hasRole(user: SessionUser | { role: Role } | null, minimum: Role): boolean {
  if (!user) return false;
  return RANK[user.role] >= RANK[minimum];
}
