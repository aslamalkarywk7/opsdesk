// OpsDesk Edge middleware: session gate + demo rate limit + request tracing.
// - /dashboard/:path* : any signed-in role, else redirect to /login?next=...
// - /team/:path* + /api/audit* : ADMIN only (pages redirect, APIs get 403 JSON).
// - POST /api/* : per-instance memory rate limit (20 req/min/IP); production
//   needs Upstash Redis because serverless instances do not share this Map.
// - Adds x-request-id to every matched response for log correlation.
// Matcher must list every guarded/rate-limited route explicitly. Uses the
// Edge-safe auth.config.ts (auth.ts would crash Edge via Prisma/bcrypt).
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

// Demo rate limiter (per-instance memory). Production: Upstash Redis.
const hits = new Map<string, number[]>();
function limited(ip: string, limit = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > limit;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();
  res.headers.set("x-request-id", crypto.randomUUID());

  if (req.method === "POST" && pathname.startsWith("/api/")) {
    const ip = req.headers.get("x-forwarded-for") ?? "local";
    if (limited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }

  const role = req.auth?.user?.role;

  if (pathname.startsWith("/dashboard")) {
    if (!req.auth?.user) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/team") || pathname.startsWith("/api/audit")) {
    if (!req.auth?.user) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (role !== "ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden for role " + role }, { status: 403 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return res;
});

export const config = {
  matcher: ["/dashboard/:path*", "/team/:path*", "/api/appointments", "/api/appointments/status", "/api/audit"]
};
