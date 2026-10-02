import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const membership = await prisma.membership.findFirst({ where: { userId: session.user.id } });
  if (!membership) return NextResponse.json({ error: "Workspace no encontrado." }, { status: 404 });
  const body = await request.json();
  if (!body.body?.trim()) return NextResponse.json({ error: "El contenido está vacío." }, { status: 400 });
  const content = await prisma.content.create({
    data: { workspaceId: membership.workspaceId, userId: session.user.id, title: body.title || "Instagram post", body: body.body, status: body.scheduledAt ? "SCHEDULED" : "DRAFT", scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null },
  });
  return NextResponse.json({ ok: true, content });
}
