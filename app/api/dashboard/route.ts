import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { workspace: true },
  });
  if (!membership) return NextResponse.json({ error: "Workspace no encontrado." }, { status: 404 });

  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const [connectedAccounts, postsThisMonth, aiGenerations, subscription] = await Promise.all([
    prisma.instagramAccount.count({ where: { workspaceId: membership.workspaceId, connected: true } }),
    prisma.content.count({ where: { workspaceId: membership.workspaceId, createdAt: { gte: start } } }),
    prisma.usageEvent.aggregate({
      where: { workspaceId: membership.workspaceId, type: "AI_GENERATION", createdAt: { gte: start } },
      _sum: { quantity: true },
    }),
    prisma.subscription.findUnique({ where: { workspaceId: membership.workspaceId } }),
  ]);

  return NextResponse.json({
    workspace: { id: membership.workspaceId, name: membership.workspace.name, plan: membership.workspace.plan },
    stats: {
      connectedAccounts,
      postsThisMonth,
      aiGenerations: aiGenerations._sum.quantity ?? 0,
    },
    subscription: subscription
      ? { status: subscription.status, plan: subscription.plan, currentPeriodEnd: subscription.currentPeriodEnd }
      : null,
  });
}
