import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function getDatabaseUrl() {
  const url =
    process.env.SUPABASE_POSTGRES_URL_POSTGRES_URL ??
    process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      "Database configuration is missing. Set SUPABASE_POSTGRES_URL_POSTGRES_URL or DATABASE_URL in the runtime environment."
    );
  }

  // Supabase transaction pooler (port 6543) is PgBouncer/Supavisor.
  // Prisma should use the pooler in transaction mode for serverless requests.
  if (url.includes(":6543") && !url.includes("pgbouncer=")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}pgbouncer=true&connection_limit=1`;
  }

  return url;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url: getDatabaseUrl() },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

globalForPrisma.prisma = prisma;
