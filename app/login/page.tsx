// Sign-in page (client component). Credential form + one-click demo accounts
// (password opsdesk123). Uses the redirect flow so the session cookie and
// navigation land atomically. `?next=` is the post-login target (default
// /dashboard). Server-side role routing happens in middleware + pages.
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const ACCOUNTS = [
  { email: "admin@opsdesk.demo", role: "ADMIN" },
  { email: "manager@opsdesk.demo", role: "MANAGER" },
  { email: "staff@opsdesk.demo", role: "STAFF" }
];

export default function Login({ searchParams }: { searchParams?: { next?: string; error?: string } }) {
  const next = searchParams?.next ?? "/dashboard";
  const [email, setEmail] = useState("admin@opsdesk.demo");
  // Never prefill the password (it would ship in the client bundle).
  // Clicking a demo account fills the email; type the demo password yourself.
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(searchParams?.error === "CredentialsSignin" ? "Invalid email or password." : "");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    // Redirect flow: the browser follows the callback 302, so the session
    // cookie and navigation land atomically (no fetch/navigation race).
    await signIn("credentials", { email, password, redirectTo: next });
    setBusy(false);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <div className="card p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">OpsDesk</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-slate-500">Real credential auth (Auth.js). Roles enforced server-side.</p>
        <form className="mt-5 space-y-3" onSubmit={submit}>
          <div>
            <label className="label" htmlFor="email">Work email</label>
            <input id="email" name="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="input" placeholder="Demo: opsdesk123" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">{error}</p>}
          <button className="btn-primary w-full" type="submit" disabled={busy}>
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="label">Demo accounts (password opsdesk123)</p>
          <ul className="space-y-1.5 text-sm">
            {ACCOUNTS.map((u) => (
              <li key={u.email}>
                <button type="button" onClick={() => setEmail(u.email)} className="flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 hover:bg-slate-100">
                  <span className="font-semibold">{u.email}</span>
                  <span className="text-xs font-bold uppercase text-slate-500">{u.role}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/" className="btn-ghost mt-5 w-full">Back home</Link>
      </div>
    </main>
  );
}
