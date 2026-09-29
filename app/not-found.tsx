export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">404</p>
      <h1 className="mt-2 text-2xl font-extrabold">Page not found</h1>
      <p className="mt-1 text-sm text-slate-500">The page you requested does not exist.</p>
      <a href="/" className="btn-primary mt-5">Back home</a>
    </main>
  );
}
