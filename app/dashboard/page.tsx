import Link from "next/link";
import { redirect } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import StatCard from "@/components/StatCard";
import Topbar from "@/components/Topbar";
import RoleBanner from "@/components/RoleBanner";
import { auth } from "@/auth";
import { appointments, lowStockItems, stats } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { paginate } from "@/lib/paginate";
import { recentAudit } from "@/lib/audit";

function pageUrl(q: string, page: number): string {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  p.set("page", String(page));
  return `/dashboard?${p.toString()}`;
}

function ActionButtons({ id, role }: { id: string; role: string }) {
  const can = (to: string) =>
    role !== "STAFF" || to === "checked_in";
  const btn = (to: string, label: string) =>
    can(to) ? (
      <form key={to} action="/api/appointments/status" method="post" className="inline">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="status" value={to} />
        <button type="submit" className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold hover:bg-slate-50">
          {label}
        </button>
      </form>
    ) : null;
  return (
    <div className="flex gap-1.5">
      {btn("checked_in", "Check in")}
      {btn("completed", "Complete")}
      {btn("cancelled", "Cancel")}
    </div>
  );
}

export default async function Dashboard({
  searchParams
}: {
  searchParams?: { q?: string; page?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/dashboard");
  const user = {
    name: session.user.name ?? "User",
    email: session.user.email ?? "",
    role: session.user.role
  };

  const q = searchParams?.q ?? "";
  const needle = q.trim().toLowerCase();
  const filtered = needle
    ? appointments.filter(
        (a) =>
          a.patient.toLowerCase().includes(needle) ||
          a.doctor.toLowerCase().includes(needle) ||
          a.id.toLowerCase().includes(needle)
      )
    : appointments;
  const { rows, total, page, totalPages } = paginate(filtered, Number(searchParams?.page ?? "1"), 4);

  const isStaff = user.role === "STAFF";
  const isAdmin = user.role === "ADMIN";
  const tasks = appointments.filter((a) => a.status === "scheduled" || a.status === "checked_in").slice(0, 4);
  const approvals = isStaff ? [] : appointments.filter((a) => a.status === "scheduled");
  const stock = isStaff ? [] : lowStockItems().slice(0, 5);
  const trail = isAdmin ? recentAudit(5) : [];

  return (
    <>
      <Topbar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
        <div className="flex flex-col gap-3">
          <RoleBanner name={user.name} role={user.role} />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                {isStaff ? "My tasks" : "Dashboard"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {isStaff
                  ? "Today check-ins assigned to you."
                  : isAdmin
                    ? "Full control: operations, team and audit."
                    : "Operations: approvals, orders and stock."}
              </p>
            </div>
            <div className="flex w-full max-w-md gap-2">
              <form className="flex flex-1 gap-2" action="/dashboard" method="get">
                <input name="q" defaultValue={q} placeholder="Search patient, doctor, ID..." className="input" />
                <button type="submit" className="btn-primary whitespace-nowrap">Search</button>
              </form>
              <form action="/api/auth/signout" method="post">
                <input type="hidden" name="callbackUrl" value="/login" />
                <button type="submit" className="btn-ghost whitespace-nowrap">Sign out</button>
              </form>
            </div>
          </div>
        </div>

        {!isStaff && (
          <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Today appointments" value={String(stats.todayAppointments)} hint="+4 vs yesterday" />
            <StatCard label="Low stock" value={String(stats.lowStock)} hint="Needs reorder" />
            <StatCard label="Pending orders" value={String(stats.pendingOrders)} hint="3 high priority" />
            <StatCard label="Revenue / month" value={formatMoney(stats.revenueMonth)} hint="Across 2 branches" />
          </section>
        )}

        {isStaff && (
          <section className="card mt-5 p-5">
            <h2 className="text-sm font-bold">Check-in queue</h2>
            <div className="mt-3 space-y-2">
              {tasks.map((a) => (
                <div key={a.id} className="flex flex-col gap-2 rounded-xl bg-slate-50 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm font-semibold">{a.time} - {a.patient} <span className="font-normal text-slate-500">({a.doctor})</span></span>
                  <ActionButtons id={a.id} role={user.role} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="appointments" className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="table-wrap lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-bold">Appointments</h2>
              <span className="text-xs text-slate-500">{total} total - page {page}/{totalPages}</span>
            </div>
            <table className="data">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id}>
                    <td className="font-semibold">{a.id}</td>
                    <td>{a.patient}</td>
                    <td>{a.doctor}</td>
                    <td className="whitespace-nowrap">{a.date} {a.time}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td><ActionButtons id={a.id} role={user.role} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-4 py-3">
              {page > 1 ? (
                <Link href={pageUrl(q, page - 1)} className="btn-ghost text-xs">Previous</Link>
              ) : <span />}
              {page < totalPages ? (
                <Link href={pageUrl(q, page + 1)} className="btn-ghost text-xs">Next</Link>
              ) : <span />}
            </div>
          </div>

          <div className="space-y-4">
            {!isStaff && (
              <div className="card p-5">
                <h2 className="text-sm font-bold">Pending approvals ({approvals.length})</h2>
                <div className="mt-3 space-y-2">
                  {approvals.slice(0, 3).map((a) => (
                    <div key={a.id} className="rounded-xl bg-slate-50 px-3 py-2.5">
                      <p className="text-sm font-semibold">{a.patient}</p>
                      <p className="text-xs text-slate-500">{a.date} {a.time} - {a.doctor}</p>
                      <div className="mt-2"><ActionButtons id={a.id} role={user.role} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!isStaff && (
              <div className="card p-5">
                <h2 className="text-sm font-bold">Low stock alerts</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {stock.map((s) => (
                    <li key={s.sku} className="flex justify-between rounded-xl bg-red-50 px-3 py-2">
                      <span className="font-semibold">{s.name}</span>
                      <span className="text-xs font-bold text-red-600">{s.qty}/{s.min}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {isAdmin && (
              <div className="card p-5">
                <h2 className="text-sm font-bold">Latest audit</h2>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                  {trail.length === 0 && <li>No entries yet this session.</li>}
                  {trail.map((t, i) => (
                    <li key={i} className="rounded-lg bg-slate-50 px-2.5 py-1.5">
                      <span className="font-semibold">{t.actor}</span> {t.action} {t.entity} {t.entityId}
                    </li>
                  ))}
                </ul>
                <Link href="/team" className="btn-primary mt-4 w-full text-xs">Open team & audit</Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
