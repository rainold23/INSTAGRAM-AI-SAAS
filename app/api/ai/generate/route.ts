import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPlanLimit } from "@/lib/plan";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    const { prompt } = await req.json();
    if (typeof prompt !== "string" || prompt.trim().length < 3 || prompt.length > 4000) return NextResponse.json({ error: "Escribe una solicitud de entre 3 y 4000 caracteres." }, { status: 400 });
    const membership = await prisma.membership.findFirst({ where: { userId: session.user.id }, include: { workspace: true } });
    if (!membership) return NextResponse.json({ error: "Workspace no encontrado." }, { status: 404 });
    const start = new Date(); start.setDate(1); start.setHours(0, 0, 0, 0);
    const used = await prisma.usageEvent.aggregate({ where: { workspaceId: membership.workspaceId, type: "AI_GENERATION", createdAt: { gte: start } }, _sum: { quantity: true } });
    const limit = getPlanLimit(membership.workspace.plan, "aiGenerations");
    const count = used._sum.quantity ?? 0;
    if (count >= limit) return NextResponse.json({ error: "Has alcanzado el límite de IA de tu plan (" + limit + " generaciones/mes)." }, { status: 429 });
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      await prisma.usageEvent.create({ data: { userId: session.user.id, workspaceId: membership.workspaceId, type: "AI_GENERATION" } });
      return NextResponse.json({ demo: true, content: "Instagram post concept\n\nHook: " + prompt + "\n\nCaption: Turn this idea into a clear, engaging story for your audience. Add a strong opening, 2–3 useful points, and a simple call to action.\n\nHashtags: #instagram #contentcreator #socialmedia #marketing #growth" });
    }
    const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + key }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-5-mini", input: "Create Instagram content for this request: " + prompt + ". Return a hook, caption, CTA and 8 relevant hashtags.", max_output_tokens: 700 }) });
    const d = await response.json();
    if (!response.ok) return NextResponse.json({ error: d?.error?.message || "AI request failed." }, { status: 500 });
    await prisma.usageEvent.create({ data: { userId: session.user.id, workspaceId: membership.workspaceId, type: "AI_GENERATION" } });
    return NextResponse.json({ content: d.output_text || "No content generated." });
  } catch { return NextResponse.json({ error: "No se pudo generar contenido." }, { status: 500 }); }
}
