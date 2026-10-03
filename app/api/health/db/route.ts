import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const configured = Boolean(process.env.SUPABASE_POSTGRES_URL_POSTGRES_URL);

  if (!configured) {
    return NextResponse.json(
      {
        ok: false,
        databaseConfigured: false,
        error: "SUPABASE_POSTGRES_URL_POSTGRES_URL is not configured in the runtime environment.",
      },
      { status: 503 }
    );
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, databaseConfigured: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    console.error("Database health check failed:", error);
    return NextResponse.json(
      {
        ok: false,
        databaseConfigured: true,
        error: message.replace(/postgres(ql)?:\/\/[^\s]+/gi, "postgresql://[redacted]"),
      },
      { status: 503 }
    );
  }
}
