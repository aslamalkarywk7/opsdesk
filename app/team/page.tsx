import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import RoleBanner from "@/components/RoleBanner";
import { auth } from "@/auth";
import { getDemoUsers } from "@/lib/demo-users";
import { recentAudit } from "@/lib/audit";
import { snapshot } from "@/lib/metrics";

// ADMIN only (also enforced in middleware.ts).
export default async function Team() {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/team");
  if (session.user.role !== "ADMIN") redirect("/dashboard");
  const user = { name: session.user.name ?? "Admin", role: session.user.role };

  const users = getDemoUsers();
  const trail = recentAudit(50);
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
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-bold">Users & roles</h2>
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
            <p className="mt-1 text-xs text-slate-500">Uptime {metrics.uptimeSeconds}s since last deploy.</p>
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
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-bold">Audit trail ({trail.length})</h2>
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
