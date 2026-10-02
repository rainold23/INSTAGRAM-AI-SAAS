import Link from "next/link";
import { ArrowRight, Bot, CalendarDays, BarChart3, Instagram, Sparkles, ShieldCheck } from "lucide-react";

const features = [
  { icon: Bot, title: "AI Content", text: "Generate captions, content ideas and campaign concepts in seconds." },
  { icon: CalendarDays, title: "Content Calendar", text: "Organize your publishing workflow from one clean dashboard." },
  { icon: BarChart3, title: "Analytics", text: "Track reach, engagement and content performance as the product grows." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08090d]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <div className="rounded-xl bg-white/10 p-2"><Sparkles size={18}/></div>
          Instagram AI
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="rounded-xl px-4 py-2 text-sm text-white/70 hover:text-white">Sign in</Link>
          <Link href="/dashboard" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black">Open dashboard</Link>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 text-center">
        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
          <Instagram size={16}/> AI-powered Instagram growth workspace
        </div>
        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
          Turn your Instagram workflow into an <span className="gradient-text">AI system.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/55">
          Create content, connect your Instagram account, plan campaigns and understand performance from one SaaS dashboard.
        </p>
        <div className="mt-9 flex justify-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-black">
            Start building <ArrowRight size={18}/>
          </Link>
          <a href="#features" className="rounded-2xl border border-white/10 px-6 py-3 text-white/75">Explore features</a>
        </div>
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 text-left md:grid-cols-3" id="features">
          {features.map(({icon: Icon, title, text}) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <Icon size={22} className="mb-5"/>
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/50">{text}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-5 flex max-w-4xl items-center justify-center gap-2 text-sm text-white/40">
          <ShieldCheck size={16}/> Secure-by-design architecture with secrets kept server-side.
        </div>
      </section>
    </main>
  );
}
