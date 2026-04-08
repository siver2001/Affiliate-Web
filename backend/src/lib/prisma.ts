import { PrismaClient } from "@prisma/client";

import { env } from "../config/env";

let prisma: PrismaClient | null = null;

export function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          // Prefer the direct/session-pool URL when available because it is the
          // only confirmed-working endpoint in this environment.
          url: env.DIRECT_URL || env.DATABASE_URL
        }
      }
    });
  }
  return prisma;
}
