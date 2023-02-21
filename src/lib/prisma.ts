import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({});

if (process.env.API_URL === "trade.isepinvest.fr/api")
  globalForPrisma.prisma = prisma;
