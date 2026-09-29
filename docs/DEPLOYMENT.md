# Deployment (Vercel)

1. Push `opsdesk/` to GitHub.
2. Vercel > Add New Project > import repo, root directory `opsdesk`, framework Next.js.
3. Env vars: `DATABASE_URL` (Neon, optional for demo), `NEXTAUTH_SECRET` (session signing - set a long random value), `NEXTAUTH_URL`.
4. Deploy. Verify `/api/health`, `/login`, `/dashboard` (per role), `/team` (admin), `/api/stats`.
5. Add custom domain + Vercel Analytics. Screenshots in `public/screenshots/` double as CV assets.
