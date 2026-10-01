# Go-live checklist (needs your accounts - 15 minutes)

Deploy steps: [docs/DEPLOYMENT.md](DEPLOYMENT.md). Data: [docs/DATABASE.md](DATABASE.md). APIs to verify: [docs/API.md](API.md).

## 1. Neon Postgres (5 min)

1. Sign up at neon.tech, New Project, region closest to Vercel `iad1`.
2. Copy the pooled connection string.
3. Locally: set `DATABASE_URL` in `.env.local`, then:
   ```bash
   npm run db:push
   npm run db:seed
   ```
4. Verify: `npm run dev`, sign in with `admin@opsdesk.demo` / `opsdesk123`,
   open `/api/health` - `"db": true`, `/api/appointments` - `"source": "db"`.

## 2. GitHub + green CI (5 min)

1. Push this repo (root = project root, `package.json` in `/`).
2. The workflow `.github/workflows/ci.yml` runs on push to `main` + pull requests, two jobs: `quality` (`npm ci` + `npm test` + `npm run build`) and `e2e` (Playwright Chromium install + `build` + `smoke` + `e2e` with `AUTH_SECRET` + `DEMO_PASSWORD`).
3. Check Actions tab - green check required before deploy.

## 3. Vercel live URL (5 min)

1. Vercel > Add New Project > import the repo, Root Directory `./` (empty, NOT `opsdesk`).
2. Environment Variables: `DATABASE_URL`, `AUTH_SECRET` + `NEXTAUTH_SECRET` (same value, `openssl rand -base64 32`), `NEXTAUTH_URL` (your `https://xxx.vercel.app` URL), `DEMO_PASSWORD`.
3. Deploy. Verify: `/api/health` (`db: true`), `/login` per role, `/team` as admin.
4. Live URL: `https://opsdesk-vjez.vercel.app/` (already in `README.md` + GitHub homepage).

## 4. Evidence for hiring managers

- `npm test` - 7/7 unit checks
- `npm run smoke` - 25 live-server checks (RBAC, contracts, gallery, metrics)
- `npm run e2e` - 5/5 real Chromium flows (guards, per-role dashboards, search, team RBAC)
- `public/screenshots/` - 10 UI captures + `designs/` (all 65 variants across 9 pages)
- Lighthouse (landing, desktop, measured Oct 2026): Accessibility 98, Best Practices 100, SEO 100 (re-run per deploy with `npx lighthouse <url> --view`)
