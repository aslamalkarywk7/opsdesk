// Lazy Prisma client. Returns null when DATABASE_URL is missing so the
// Vercel demo keeps working on in-memory data. Set DATABASE_URL (Neon)
// and run `prisma db push` + `npm run db:seed` for production data.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getDb(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null;
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}
