import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function getMembership(userId: string) {
  return prisma.membership.findFirst({ where: { userId }, include: { workspace: true } });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const membership = await getMembership(session.user.id);
  if (!membership) return NextResponse.json({ error: "Workspace no encontrado." }, { status: 404 });
  const content = await prisma.content.findMany({ where: { workspaceId: membership.workspaceId }, orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }], take: 100 });
  return NextResponse.json({ content });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const membership = await getMembership(session.user.id);
  if (!membership) return NextResponse.json({ error: "Workspace no encontrado." }, { status: 404 });
  const body = await request.json();
  if (typeof body.body !== "string" || !body.body.trim() || body.body.length > 2200) return NextResponse.json({ error: "El contenido debe tener entre 1 y 2200 caracteres." }, { status: 400 });
  let scheduledAt: Date | null = null;
  if (body.scheduledAt) {
    scheduledAt = new Date(body.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) return NextResponse.json({ error: "La fecha programada no es válida." }, { status: 400 });
  }
  const content = await prisma.content.create({ data: { workspaceId: membership.workspaceId, userId: session.user.id, title: typeof body.title === "string" && body.title.trim() ? body.title.trim().slice(0, 120) : "Instagram post", body: body.body.trim(), status: scheduledAt ? "SCHEDULED" : "DRAFT", scheduledAt } });
  return NextResponse.json({ ok: true, content });
}
