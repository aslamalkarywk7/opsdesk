// Site header: logo + nav (Dashboard, Appointments anchor, Designs gallery,
// raw JSON probes API stats/health) + Sign in. Shown on public + app pages.
import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard#appointments", label: "Appointments" },
  { href: "/showcase", label: "Designs" },
  { href: "/api/stats", label: "API stats" },
  { href: "/api/health", label: "Health" }
];

export default function Topbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 font-extrabold text-white">
            O
          </span>
          <span className="text-sm font-extrabold tracking-tight">OpsDesk</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-2.5 py-2 font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 sm:px-3"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="btn-primary ml-1 px-3 py-2 text-xs sm:text-sm">Sign in</Link>
        </nav>
      </div>
    </header>
  );
}
