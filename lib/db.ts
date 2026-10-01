// Lazy Prisma client singleton. Returns null when DATABASE_URL is missing so
// the Vercel demo keeps working on in-memory data (see lib/data.ts).
// Node runtime only - never import from middleware.ts (Edge crash).
// Production: set DATABASE_URL (Neon) then `npm run db:push` + `npm run db:seed`.
// See prisma/schema.prisma + docs/DATABASE.md.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getDb(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null;
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}
