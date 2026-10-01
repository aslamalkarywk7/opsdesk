// GET /api/metrics: uptime + per-route counters (see lib/metrics.ts).
// Counts itself on every call. Version mirrors package.json. No auth (public
// demo); /team restricts the rendered view to ADMIN instead.
// Honesty note: `persistence: "memory"` - counters reset on cold start because
// serverless instances do not share memory. Production needs Vercel Analytics
// or Upstash; see docs/SECURITY.md (Planned).
import { NextResponse } from "next/server";
import { snapshot, count } from "@/lib/metrics";

export async function GET() {
  count("GET /api/metrics");
  return NextResponse.json({ service: "opsdesk", version: "1.0.0", persistence: "memory", ...snapshot() }, { status: 200 });
}
