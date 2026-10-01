# Deployment (Vercel)

Live: https://opsdesk-vjez.vercel.app/

1. Push this repo to GitHub (repo root = project root, `package.json` in `/`).
2. Vercel > Add New Project > import repo, Root Directory `./` (empty), framework Next.js, Build Command `npm run build`.
3. Env vars (Project Settings > Environment Variables, all environments):
   - `AUTH_SECRET` + `NEXTAUTH_SECRET` (same long random value: `openssl rand -base64 32`)
   - `NEXTAUTH_URL` = `https://opsdesk-vjez.vercel.app`
   - `DATABASE_URL` (Neon Postgres, optional for demo mode)
   - `DEMO_PASSWORD` (default `opsdesk123`)
4. Deploy. Verify `https://opsdesk-vjez.vercel.app/api/health`, `/login`, `/dashboard` (per role), `/team` (admin), `/api/stats`.
5. Add custom domain + Vercel Analytics. Screenshots in `public/screenshots/` double as CV assets.

Note: `npm run build` runs `prisma generate && next build`, and `middleware.ts`
uses Edge-safe `auth.config.ts` (no Prisma/bcrypt) so Vercel Edge does not crash.
Checklist: [docs/DEPLOY-CHECKLIST.md](DEPLOY-CHECKLIST.md). Data: [docs/DATABASE.md](DATABASE.md). Verify with [docs/API.md](API.md).
