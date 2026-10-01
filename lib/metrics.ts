// In-memory request metrics (per serverless instance - resets on cold start).
// count() increments a route key; snapshot() returns { uptimeSeconds, requests }.
// Surfaced at GET /api/metrics + /team. Production: export to Vercel Analytics.
// See lib/audit.ts (trail) + docs/ARCHITECTURE.md.
const counters = new Map<string, number>();
const startedAt = Date.now();

export function count(route: string): void {
  counters.set(route, (counters.get(route) ?? 0) + 1);
}

export function snapshot(): { uptimeSeconds: number; requests: Record<string, number> } {
  return {
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    requests: Object.fromEntries(counters)
  };
}
