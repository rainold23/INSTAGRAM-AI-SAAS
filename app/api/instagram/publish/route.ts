import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { publishInstagramImage } from "@/lib/instagram";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const { contentId } = await request.json();
  if (typeof contentId !== "string") return NextResponse.json({ error: "contentId es requerido." }, { status: 400 });

  const membership = await prisma.membership.findFirst({ where: { userId: session.user.id } });
  if (!membership) return NextResponse.json({ error: "Workspace no encontrado." }, { status: 404 });

  const content = await prisma.content.findFirst({
    where: { id: contentId, workspaceId: membership.workspaceId, userId: session.user.id },
  });
  if (!content) return NextResponse.json({ error: "Contenido no encontrado." }, { status: 404 });
  if (!content.mediaUrl) return NextResponse.json({ error: "Añade una URL pública de imagen antes de publicar." }, { status: 400 });
  if (content.status === "PUBLISHED") return NextResponse.json({ error: "Este contenido ya fue publicado." }, { status: 409 });

  const account = await prisma.instagramAccount.findFirst({ where: { workspaceId: membership.workspaceId, connected: true }, orderBy: { updatedAt: "desc" } });
  if (!account) return NextResponse.json({ error: "Conecta una cuenta de Instagram primero." }, { status: 400 });

  try {
    const mediaId = await publishInstagramImage(account.id, content.mediaUrl, content.body);
    const updated = await prisma.content.update({ where: { id: content.id }, data: { status: "PUBLISHED", publishedAt: new Date(), scheduledAt: null } });
    return NextResponse.json({ ok: true, mediaId, content: updated });
  } catch (error) {
    await prisma.content.update({ where: { id: content.id }, data: { status: "FAILED" } });
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo publicar en Instagram." }, { status: 502 });
  }
}
