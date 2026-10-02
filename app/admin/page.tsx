import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["OWNER", "ADMIN"].includes(session.user.role ?? "")) redirect("/dashboard");

  const [users, workspaces, subscriptions, content] = await Promise.all([
    prisma.user.count(),
    prisma.workspace.count(),
    prisma.subscription.count({ where: { status: { in: ["active", "trialing"] } } }),
    prisma.content.count(),
  ]);

  return <main className="min-h-screen bg-[#08090d] text-white">
    <header className="border-b border-white/10 px-6 py-5"><div className="mx-auto max-w-7xl flex items-center justify-between"><div><p className="text-sm text-white/40">Owner Console</p><h1 className="text-2xl font-bold">Admin</h1></div><a href="/dashboard" className="text-sm text-white/50 hover:text-white">Volver al dashboard</a></div></header>
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid gap-4 md:grid-cols-4">
        {[["Usuarios",users],["Workspaces",workspaces],["Suscripciones activas",subscriptions],["Contenidos",content]].map(([label,value])=><div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><p className="text-sm text-white/40">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>)}
      </div>
      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[.035] p-6">
        <h2 className="font-semibold">Control de plataforma</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 p-4"><b>Clientes</b><p className="mt-1 text-sm text-white/40">Alta, acceso y roles por workspace.</p></div>
          <div className="rounded-2xl border border-white/10 p-4"><b>Facturación</b><p className="mt-1 text-sm text-white/40">Estado de planes y suscripciones.</p></div>
          <div className="rounded-2xl border border-white/10 p-4"><b>Uso de IA</b><p className="mt-1 text-sm text-white/40">Eventos de consumo para límites y métricas.</p></div>
        </div>
      </section>
    </div>
  </main>;
}
