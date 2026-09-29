import Link from "next/link";

const features = [
  { title: "Appointments & Patients", desc: "Scheduling with statuses, search, pagination and audit trail." },
  { title: "Inventory & Orders", desc: "Stock levels, low-stock alerts, orders with idempotent creation." },
  { title: "Roles & Audit", desc: "Admin / Manager / Staff RBAC, every mutation logged." },
  { title: "Vercel-ready API", desc: "Serverless routes under app/api with Zod validation." }
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">OpsDesk v1.0</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Business management,
            <span className="text-brand-600"> precise and calm.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-500 sm:text-base">
            Clinics, inventory and orders in one responsive dashboard. Built Vercel-native with
            Next.js App Router, TypeScript strict, Tailwind and serverless API routes.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard" className="btn-primary">Open dashboard</Link>
          <Link href="/login" className="btn-primary bg-ink-900 hover:bg-slate-800">Sign in</Link>
          <a href="/api/health" className="btn-ghost">API health</a>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="card p-5">
            <h2 className="text-sm font-bold text-ink-900">{f.title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink-500">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="card mt-6 flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">65 dashboard designs</h2>
          <p className="mt-1 text-sm text-ink-500">8 domains x 8 layout systems. Proof of UI range for design-heavy roles.</p>
        </div>
        <Link href="/showcase" className="btn-primary whitespace-nowrap">Browse gallery</Link>
      </section>

      <section className="card mt-6 grid gap-6 p-6 sm:grid-cols-3">
        <div>
          <p className="label">Stack</p>
          <p className="text-sm font-semibold">Next.js 14 / TypeScript / Tailwind / Prisma / Postgres</p>
        </div>
        <div>
          <p className="label">Deploy</p>
          <p className="text-sm font-semibold">Vercel (iad1) + Neon Postgres + Upstash Redis</p>
        </div>
        <div>
          <p className="label">Quality</p>
          <p className="text-sm font-semibold">Zod validation / RBAC / Audit log / Tests / CI</p>
        </div>
      </section>
    </main>
  );
}
