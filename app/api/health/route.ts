import { NextResponse } from "next/server";
import { count } from "@/lib/metrics";
import { getDb } from "@/lib/db";

export async function GET() {
  count("GET /api/health");
  return NextResponse.json(
    { service: "opsdesk", status: "ok", time: new Date().toISOString(), region: "vercel", db: Boolean(getDb()) },
    { status: 200 }
  );
}
