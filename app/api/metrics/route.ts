import { NextResponse } from "next/server";
import { snapshot, count } from "@/lib/metrics";

export async function GET() {
  count("GET /api/metrics");
  return NextResponse.json({ service: "opsdesk", version: "1.1.0", ...snapshot() }, { status: 200 });
}
