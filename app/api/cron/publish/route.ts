import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publishInstagramImage } from "@/lib/instagram";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!secret || authorization !== "Bearer " + secret) return new NextResponse("Unauthorized", { status: 401 });

  const due = await prisma.content.findMany({
    where: { status: "SCHEDULED", scheduledAt: { lte: new Date() }, mediaUrl: { not: null } },
    orderBy: { scheduledAt: "asc" },
    take: 20,
  });

  let published = 0;
  for (const content of due) {
    const account = await prisma.instagramAccount.findFirst({ where: { workspaceId: content.workspaceId, connected: true }, orderBy: { updatedAt: "desc" } });
    if (!account || !content.mediaUrl) {
      await prisma.content.update({ where: { id: content.id }, data: { status: "FAILED" } });
      continue;
    }
    try {
      await publishInstagramImage(account.id, content.mediaUrl, content.body);
      await prisma.content.update({ where: { id: content.id }, data: { status: "PUBLISHED", publishedAt: new Date() } });
      published++;
    } catch {
      await prisma.content.update({ where: { id: content.id }, data: { status: "FAILED" } });
    }
  }

  return NextResponse.json({ ok: true, checked: due.length, published });
}
