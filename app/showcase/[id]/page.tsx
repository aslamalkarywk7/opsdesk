import Link from "next/link";
import { notFound } from "next/navigation";
import { DESIGNS } from "@/lib/designs";
import { appointments } from "@/lib/data";
import type { Appointment } from "@/lib/schemas";

export function generateStaticParams() {
  return DESIGNS.map((d) => ({ id: d.id }));
}

type Params = { q?: string; status?: string; sort?: string; dir?: string; page?: string };

const STATUSES = ["all", "scheduled", "checked_in", "completed", "cancelled"] as const;

function href(id: string, p: Params): string {
  const q = new URLSearchParams();
  if (p.q) q.set("q", p.q);
  if (p.status && p.status !== "all") q.set("status", p.status);
  if (p.sort) q.set("sort", p.sort);
  if (p.dir) q.set("dir", p.dir);
  if (p.page) q.set("page", p.page);
  const s = q.toString();
  return `/showcase/${id}${s ? `?${s}` : ""}`;
}

function sortRows(rows: Appointment[], sort: string, dir: string): Appointment[] {
  const valid = ["id", "patient", "doctor", "date", "status"];
  const key = (valid as string[]).includes(sort) ? (sort as keyof Appointment) : "date";
  const mul = dir === "desc" ? -1 : 1;
  return [...rows].sort((a, b) => String(a[key]).localeCompare(String(b[key])) * mul);
}

// Public live demo: full themed workspace with search, status filter, sorting, pagination.
export default function LiveDesign({ params, searchParams }: { params: { id: string }; searchParams?: Params }) {
  const d = DESIGNS.find((x) => x.id === params.id);
  if (!d) notFound();

  const q = (searchParams?.q ?? "").trim().toLowerCase();
  const status = (searchParams?.status ?? "all").toLowerCase();
  const sort = searchParams?.sort ?? "date";
  const dir = searchParams?.dir === "desc" ? "desc" : "asc";

  const filtered = appointments.filter((a) => {
    const okQ = !q || a.patient.toLowerCase().includes(q) || a.doctor.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
    const okS = status === "all" || a.status === status;
    return okQ && okS;
  });
  const sorted = sortRows(filtered, sort, dir);
  const limit = 4;
  const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
  const page = Math.min(Math.max(1, Number(searchParams?.page ?? "1") || 1), totalPages);
  const rows = sorted.slice((page - 1) * limit, page * limit);

  const col = (key: string, label: string) => {
    const nextDir = sort === key && dir === "asc" ? "desc" : "asc";
    const arrow = sort === key ? (dir === "asc" ? " ^" : " v") : "";
    return (
      <Link href={href(d.id, { q: searchParams?.q, status: searchParams?.status, sort: key, dir: nextDir })} style={{ color: d.muted }}>
        {label}{arrow}
      </Link>
    );
  };

  const BARS = [42, 68, 35, 80, 55, 90, 48, 72, 60, 84, 40, 66];

  return (
    <div className="min-h-screen" style={{ background: d.bg, color: d.ink }}>
      <header className="flex items-center justify-between px-4 py-3 sm:px-6" style={d.nav === "top" ? { background: d.surface, borderBottom: `1px solid ${d.muted}44` } : undefined}>
        <span className="text-sm font-extrabold">{d.name}</span>
        <Link href="/showcase" className="text-xs font-bold underline" style={{ color: d.accent }}>Back to gallery</Link>
      </header>

      <div className="mx-auto flex max-w-6xl gap-4 px-4 pb-16 sm:px-6">
        {d.nav === "side" && (
          <aside className="hidden w-44 shrink-0 flex-col gap-2 rounded-2xl p-3 sm:flex" style={{ background: d.surface }}>
            {["Overview", "Patients", "Orders", "Stock", "Team", "Settings"].map((x, i) => (
              <span key={x} className="rounded-lg px-3 py-2 text-xs font-bold" style={i === 0 ? { background: d.accent, color: "#fff" } : { color: d.muted }}>{x}</span>
            ))}
          </aside>
        )}
        {d.nav === "rail" && (
          <aside className="hidden w-12 shrink-0 flex-col items-center gap-3 rounded-2xl py-4 sm:flex" style={{ background: d.surface }}>
            {[d.accent, d.muted, d.muted, d.muted].map((c, i) => (
              <span key={i} className="h-5 w-5 rounded-full" style={{ background: c, opacity: i === 0 ? 1 : 0.4 }} />
            ))}
          </aside>
        )}

        <main className="min-w-0 flex-1">
          <div className={`grid gap-3 sm:grid-cols-3 ${d.density === "dense" ? "gap-2" : "gap-4"}`}>
            {[
              { k: "Shown", v: String(filtered.length) },
              { k: "Page", v: `${page}/${totalPages}` },
              { k: "Revenue", v: "$48,250" }
            ].map((s) => (
              <div key={s.k} className="rounded-2xl p-4" style={{ background: d.surface }}>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: d.muted }}>{s.k}</p>
                <p className="mt-1 text-2xl font-extrabold">{s.v}</p>
              </div>
            ))}
          </div>

          <form className="mt-4 flex gap-2" action={`/showcase/${d.id}`} method="get">
            {status !== "all" && <input type="hidden" name="status" value={status} />}
            <input name="q" defaultValue={searchParams?.q ?? ""} placeholder="Search patient, doctor, ID..." className="input flex-1" style={{ background: d.surface, color: d.ink, borderColor: d.muted + "55" }} />
            <button type="submit" className="rounded-xl px-4 py-2.5 text-sm font-bold text-white" style={{ background: d.accent }}>Search</button>
          </form>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {STATUSES.map((s) => {
              const n = s === "all" ? appointments.length : appointments.filter((a) => a.status === s).length;
              const on = status === s;
              return (
                <Link
                  key={s}
                  href={href(d.id, { q: searchParams?.q, status: s })}
                  className="rounded-full px-3 py-1 text-xs font-bold"
                  style={on ? { background: d.accent, color: "#fff" } : { background: d.surface, color: d.muted }}
                >
                  {s.replace("_", " ")} ({n})
                </Link>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl p-4" style={{ background: d.surface }}>
            <p className="text-xs font-bold" style={{ color: d.muted }}>This week</p>
            {d.chart === "donut" ? (
              <div className="mx-auto mt-2 h-28 w-28 rounded-full" style={{ background: `conic-gradient(${d.accent} 0 65%, ${d.muted}55 65% 100%)` }}>
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-16 w-16 rounded-full text-center text-xs font-extrabold leading-[4rem]" style={{ background: d.surface }}>65%</div>
                </div>
              </div>
            ) : d.chart === "line" ? (
              <svg viewBox="0 0 200 60" className="mt-2 h-24 w-full">
                <polyline points="0,50 20,40 40,44 60,28 80,34 100,18 120,24 140,10 160,16 180,8 200,12" fill="none" stroke={d.accent} strokeWidth="4" strokeLinecap="round" />
              </svg>
            ) : (
              <div className="mt-2 flex h-24 items-end gap-1.5">
                {BARS.map((h, i) => (
                  <div key={i} className="flex-1 rounded" style={{ height: `${h}%`, background: i % 3 === 0 ? d.muted : d.accent, opacity: i % 3 === 0 ? 0.45 : 1 }} />
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl" style={{ background: d.surface }}>
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr style={{ color: d.muted }} className="text-[10px] uppercase tracking-widest">
                  <th className="px-4 py-3">{col("id", "ID")}</th>
                  <th className="px-4 py-3">{col("patient", "Patient")}</th>
                  <th className="px-4 py-3">{col("doctor", "Doctor")}</th>
                  <th className="px-4 py-3">{col("status", "Status")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-sm" style={{ color: d.muted }}>No results - clear search or filter.</td></tr>
                )}
                {rows.map((a) => (
                  <tr key={a.id} style={{ borderTop: `1px solid ${d.muted}33` }}>
                    <td className="px-4 py-2.5 font-semibold">{a.id}</td>
                    <td className="px-4 py-2.5">{a.patient}</td>
                    <td className="px-4 py-2.5">{a.doctor}</td>
                    <td className="px-4 py-2.5">
                      <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: d.accent + "22", color: d.accent }}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-4 py-3 text-xs font-bold">
              {page > 1 ? (
                <Link href={href(d.id, { q: searchParams?.q, status: searchParams?.status, sort, dir, page: String(page - 1) })} style={{ color: d.accent }}>Previous</Link>
              ) : <span />}
              <span style={{ color: d.muted }}>{filtered.length} results</span>
              {page < totalPages ? (
                <Link href={href(d.id, { q: searchParams?.q, status: searchParams?.status, sort, dir, page: String(page + 1) })} style={{ color: d.accent }}>Next</Link>
              ) : <span />}
            </div>
          </div>

          <p className="mt-4 text-center text-xs" style={{ color: d.muted }}>
            Theme demo - <Link href="/login" className="font-bold underline" style={{ color: d.accent }}>sign in</Link> for the fully interactive workspace with actions.
          </p>
        </main>
      </div>
    </div>
  );
}
