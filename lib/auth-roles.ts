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
