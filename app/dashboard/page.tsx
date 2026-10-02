import Link from "next/link";
import { Instagram, Sparkles, CalendarDays, BarChart3, Settings, Plus, ArrowUpRight } from "lucide-react";

const stats = [
  ["Connected accounts", "0"],
  ["Posts this month", "0"],
  ["Engagement", "—"],
  ["AI generations", "0"],
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#08090d]">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-semibold">Instagram AI</Link>
          <div className="flex items-center gap-3 text-sm text-white/50"><Settings size={17}/> Settings</div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="text-sm text-white/40">Workspace</p><h1 className="mt-1 text-3xl font-bold">Dashboard</h1></div>
          <button className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black"><Instagram size={18}/> Connect Instagram</button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(([label,value]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><p className="text-sm text-white/40">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>)}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-center justify-between"><div><h2 className="font-semibold">AI Content Studio</h2><p className="mt-1 text-sm text-white/40">Create your next Instagram post.</p></div><Sparkles size={20}/></div>
            <textarea className="mt-6 min-h-36 w-full rounded-2xl border border-white/10 bg-black/20 p-4 outline-none" placeholder="Describe what you want to post about..."/>
            <button className="mt-3 flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black"><Sparkles size={17}/> Generate content</button>
          </section>
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <h2 className="font-semibold">Quick actions</h2>
            <div className="mt-4 space-y-3">
              <button className="flex w-full items-center gap-3 rounded-2xl border border-white/10 p-4 text-left hover:bg-white/5"><Plus size={18}/> New content</button>
              <button className="flex w-full items-center gap-3 rounded-2xl border border-white/10 p-4 text-left hover:bg-white/5"><CalendarDays size={18}/> Content calendar</button>
              <button className="flex w-full items-center gap-3 rounded-2xl border border-white/10 p-4 text-left hover:bg-white/5"><BarChart3 size={18}/> View analytics <ArrowUpRight size={15} className="ml-auto"/></button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
