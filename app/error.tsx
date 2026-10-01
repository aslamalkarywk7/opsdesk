// App error boundary (client). Reports the crash to POST /api/errors (beacon,
// never throws) and offers a retry button. See lib/errors.ts.
"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    fetch("/api/errors", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ scope: "app-boundary", message: `${error.message} ${error.digest ?? ""}`.slice(0, 500) })
    }).catch(() => {});
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Error</p>
      <h1 className="mt-2 text-2xl font-extrabold">Something went wrong</h1>
      <p className="mt-1 text-sm text-slate-500">
        The incident was reported{error.digest ? ` (ref ${error.digest})` : ""}. Try again.
      </p>
      <button onClick={() => reset()} className="btn-primary mt-5">Try again</button>
    </main>
  );
}
