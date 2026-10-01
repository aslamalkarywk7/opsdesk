// ADMIN-only Team & audit page (also enforced in middleware.ts).
// Guards: anonymous -> /login?next=/team, non-ADMIN -> /dashboard.
// Sections: users & roles table, request metrics, full audit trail.
// Users + audit read Postgres when DATABASE_URL is set (else demo directory /
// memory trail); each section carries a Live database / Demo data badge.
// See docs/ROLES.md + docs/DATABASE.md.
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import RoleBanner from "@/components/RoleBanner";
import { auth } from "@/auth";
import { getDemoUsers } from "@/lib/demo-users";
import { recentAudit, type AuditEntry } from "@/lib/audit";
import { snapshot } from "@/lib/metrics";
import { getDb } from "@/lib/db";
import type { Role } from "@/lib/auth-roles";

export default async function Team() {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/team");
  if (session.user.role !== "ADMIN") redirect("/dashboard");
  const user = { name: session.user.name ?? "Admin", role: session.user.role };

  let users = getDemoUsers();
  let usersSource = "demo";
  let trail: AuditEntry[] = recentAudit(50);
  let auditSource = "demo";
  const db = getDb();
  if (db) {
    try {
      const rows = await db.user.findMany({ orderBy: { email: "asc" } });
      users = rows.map((u) => ({ id: u.id, email: u.email, name: u.name, role: u.role as Role }));
      usersSource = "db";
      const logs = await db.auditLog.findMany({
        include: { actor: true },
        orderBy: { createdAt: "desc" },
        take: 50
      });
      trail = logs.map((r) => ({
        at: r.createdAt.toISOString(),
        actor: r.actor?.email ?? "system",
        action: r.action,
        entity: r.entity,
        entityId: r.entityId
      }));
      auditSource = "db";
    } catch {
      // DB unreachable: stay on demo directory + memory trail.
    }
  }
  const metrics = snapshot();

  return (
    <>
      <Topbar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
        <div className="flex flex-col gap-3">
          <RoleBanner name={user.name} role={user.role} />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Team & audit</h1>
            <p className="mt-1 text-sm text-slate-500">Admin-only: roles, full audit trail and request metrics.</p>
          </div>
        </div>

        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="table-wrap">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-bold">Users & roles</h2>
              <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${usersSource === "db" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                {usersSource === "db" ? "Live database" : "Demo data"}
              </span>
            </div>
            <table className="data">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="font-semibold">{u.name}</td>
                    <td>{u.email}</td>
                    <td className="text-xs font-bold">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card p-5">
            <h2 className="text-sm font-bold">Request metrics</h2>
            <p className="mt-1 text-xs text-slate-500">Uptime {metrics.uptimeSeconds}s since last deploy. Per-instance memory: resets on cold start (production needs Upstash).</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {Object.entries(metrics.requests).map(([k, v]) => (
                <li key={k} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span className="font-mono text-xs">{k}</span>
                  <span className="font-bold">{v}</span>
                </li>
              ))}
              {Object.keys(metrics.requests).length === 0 && <li className="text-xs">No traffic yet.</li>}
            </ul>
          </div>
        </section>

        <section className="table-wrap mt-4">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-bold">Audit trail ({trail.length})</h2>
            <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${auditSource === "db" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
              {auditSource === "db" ? "Live database" : "Demo data"}
            </span>
          </div>
          <table className="data">
            <thead>
              <tr><th>Time</th><th>Actor</th><th>Action</th><th>Entity</th></tr>
            </thead>
            <tbody>
              {trail.map((t, i) => (
                <tr key={i}>
                  <td className="whitespace-nowrap font-mono text-xs">{t.at}</td>
                  <td>{t.actor}</td>
                  <td className="font-semibold">{t.action}</td>
                  <td>{t.entity} {t.entityId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}
