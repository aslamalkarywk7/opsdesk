// Demo user directory (display only). Credentials live in the database
// (seeded) or the Auth.js authorize() fallback when DATABASE_URL is missing.
import type { Role } from "./auth-roles";

export function getDemoUsers(): Array<{ id: string; email: string; name: string; role: Role }> {
  return [
    { id: "u-admin", email: "admin@opsdesk.demo", name: "Admin", role: "ADMIN" },
    { id: "u-manager", email: "manager@opsdesk.demo", name: "Manager", role: "MANAGER" },
    { id: "u-staff", email: "staff@opsdesk.demo", name: "Staff", role: "STAFF" }
  ];
}
