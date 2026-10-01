// GET /api/metrics: uptime + per-route counters (see lib/metrics.ts).
// Counts itself on every call. Version mirrors package.json. No auth (public
// demo); /team restricts the rendered view to ADMIN instead.
import { NextResponse } from "next/server";
import { snapshot, count } from "@/lib/metrics";

export async function GET() {
  count("GET /api/metrics");
  return NextResponse.json({ service: "opsdesk", version: "1.0.0", ...snapshot() }, { status: 200 });
}
