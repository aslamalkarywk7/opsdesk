import type { NextAuthConfig } from "next-auth";
import type { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { Role } from "./lib/auth-roles";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: Role } & DefaultSession["user"];
  }
  interface User {
    role: Role;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: Role;
  }
}

const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "opsdesk123";

export const DEMO_USERS: Array<{ id: string; email: string; name: string; role: Role }> = [
  { id: "u-admin", email: "admin@opsdesk.demo", name: "Admin", role: "ADMIN" },
  { id: "u-manager", email: "manager@opsdesk.demo", name: "Manager", role: "MANAGER" },
  { id: "u-staff", email: "staff@opsdesk.demo", name: "Staff", role: "STAFF" },
];

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (raw) => {
        const parsed = z
          .object({ email: z.string().email().max(120), password: z.string().min(1).max(200) })
          .safeParse(raw);
        if (!parsed.success) return null;
        const email = parsed.data.email.toLowerCase().trim();
        if (parsed.data.password !== DEMO_PASSWORD) return null;
        const demo = DEMO_USERS.find((u) => u.email === email);
        return demo ?? null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: Role }).role;
      return token;
    },
    session({ session, token }) {
      if (token.role) session.user.role = token.role;
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
};
