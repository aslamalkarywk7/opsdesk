import Link from "next/link";
import Topbar from "@/components/Topbar";
import DesignPreview from "@/components/DesignPreview";
import { DESIGNS, DESIGN_DOMAINS } from "@/lib/designs";

// Public gallery: 65 dashboard variants proving UI range for hiring managers.
export default function Showcase({ searchParams }: { searchParams?: { domain?: string } }) {
  const active = searchParams?.domain ?? "All";
  const rows = active === "All" ? DESIGNS : DESIGNS.filter((d) => d.domain === active);

  return (
    <>
      <Topbar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Design gallery - 65 variants</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Dashboard design range</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              8 domains x 8 layout systems + signature theme. Each variant is a live token-driven
              preview: palette, navigation, chart and density change per design.
            </p>
          </div>
          <Link href="/dashboard" className="btn-primary whitespace-nowrap">Open live dashboard</Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {DESIGN_DOMAINS.map((dm) => (
            <Link
              key={dm}
              href={dm === "All" ? "/showcase" : `/showcase?domain=${encodeURIComponent(dm)}`}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                active === dm
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {dm}
            </Link>
          ))}
        </div>

        <p className="mt-3 text-xs text-slate-500">{rows.length} designs shown</p>
        <section className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((d) => (
            <Link key={d.id} href={`/showcase/${d.id}`} className="card block overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card">
              <DesignPreview d={d} />
              <div className="p-4">
                <h2 className="text-sm font-bold">{d.name} <span className="font-normal text-brand-600">- open live →</span></h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">{d.blurb}</p>
                <p className="mt-2 font-mono text-[10px] text-slate-400">
                  {d.bg} {d.accent} - {d.nav}/{d.chart}/{d.density}
                </p>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}
