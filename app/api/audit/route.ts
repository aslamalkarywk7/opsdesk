import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { recentAudit } from "@/lib/audit";
import { count } from "@/lib/metrics";
import { getDb } from "@/lib/db";

// GET /api/audit - ADMIN only (also enforced in middleware.ts).
export async function GET() {
  count("GET /api/audit");
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden for role " + session.user.role }, { status: 403 });
  }

  const db = getDb();
  if (db) {
    try {
      const rows = await db.auditLog.findMany({
        include: { actor: true },
        orderBy: { createdAt: "desc" },
        take: 50
      });
      return NextResponse.json({
        data: rows.map((r) => ({
          at: r.createdAt.toISOString(),
          actor: r.actor?.email ?? "system",
          action: r.action,
          entity: r.entity,
          entityId: r.entityId
        })),
        source: "db"
      });
    } catch {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }
  return NextResponse.json({ data: recentAudit(50), source: "demo" }, { status: 200 });
}
