import { NextResponse } from "next/server";
import { stats } from "@/lib/data";
import { StatsSchema } from "@/lib/schemas";
import { count } from "@/lib/metrics";

export async function GET() {
  count("GET /api/stats");
  const parsed = StatsSchema.safeParse(stats);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid stats" }, { status: 500 });
  }
  return NextResponse.json({ data: parsed.data }, { status: 200 });
}
