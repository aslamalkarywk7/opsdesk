// OpsDesk auth (Node runtime only - never import from middleware.ts).
// Spreads auth.config.ts then upgrades it for production:
// - Attaches PrismaAdapter when DATABASE_URL exists (Auth.js Account persistence).
// - authorize() checks Postgres (bcrypt) first, falls back to demo users.
// Pages + API routes use auth()/handlers from here; Edge middleware uses the
// lightweight auth.config.ts instead. See docs/ROLES.md for the RBAC matrix.
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { z } from "zod";
import { getDb } from "./lib/db";
import type { Role } from "./lib/auth-roles";
import { authConfig, DEMO_USERS } from "./auth.config";

const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "opsdesk123";

const db = getDb();

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  ...(db ? { adapter: PrismaAdapter(db) } : {}),
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (raw) => {
        const parsed = z
          .object({ email: z.string().email().max(120), password: z.string().min(1).max(200) })
          .safeParse(raw);
        if (!parsed.success) return null;
        const email = parsed.data.email.toLowerCase().trim();

        if (db) {
          const user = await db.user.findUnique({ where: { email } });
          if (!user?.password) return null;
          const { default: bcrypt } = await import("bcryptjs");
          const ok = await bcrypt.compare(parsed.data.password, user.password);
          if (!ok) return null;
          return { id: user.id, email: user.email, name: user.name, role: user.role as Role };
        }

        if (parsed.data.password !== DEMO_PASSWORD) return null;
        const demo = DEMO_USERS.find((u) => u.email === email);
        return demo ?? null;
      },
    }),
  ],
});
