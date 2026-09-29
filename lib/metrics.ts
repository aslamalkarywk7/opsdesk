// In-memory request metrics. Production: export to Vercel Analytics / Sentry.
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
