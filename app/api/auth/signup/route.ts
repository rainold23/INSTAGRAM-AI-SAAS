import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    const email = parsed.data.email.toLowerCase().trim();
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "Ese email ya está registrado." }, { status: 409 });

    const userCount = await prisma.user.count();
    const role = userCount === 0 ? ("OWNER" as const) : ("MEMBER" as const);
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash,
        role,
        memberships: { create: { role, workspace: { create: { name: parsed.data.name + " Workspace", slug: email.split("@")[0].replace(/[^a-z0-9-]/g, "-") + "-" + Date.now() } } } },
      },
    });
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
  } catch {
    return NextResponse.json({ error: "La base de datos no está configurada o no está disponible." }, { status: 503 });
  }
}
