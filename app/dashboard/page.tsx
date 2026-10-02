"use client";

import { useState } from "react";
import {
  Instagram,
  Sparkles,
  CalendarDays,
  BarChart3,
  Settings,
  Plus,
  Loader2,
  Copy,
  Check,
  LogOut,
  CreditCard,
} from "lucide-react";

const stats = [
  ["Connected accounts", "0"],
  ["Posts this month", "0"],
  ["Engagement", "—"],
  ["AI generations", "0"],
];

function go(path: string) {
  window.location.assign(path);
}

export default function DashboardPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");

  async function generate() {
    if (!prompt.trim()) {
      setNotice("Escribe una idea primero.");
      return;
    }
    setLoading(true);
    setNotice("");
    try {
      const r = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "No se pudo generar contenido.");
      setResult(d.content || "No result");
      if (d.demo) setNotice("Modo demo: agrega OPENAI_API_KEY en Vercel para activar IA real.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "No se pudo conectar con la IA.");
    } finally {
      setLoading(false);
    }
  }

  async function connect() {
    setNotice("");
    try {
      const r = await fetch("/api/instagram/connect", { cache: "no-store" });
      const d = await r.json();
      if (d.url) window.location.assign(d.url);
      else setNotice(d.error || "Instagram todavía no está configurado.");
    } catch {
      setNotice("No se pudo iniciar la conexión con Instagram.");
    }
  }

  async function copy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <main className="min-h-screen bg-[#08090d]">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button onClick={() => go("/")} className="font-semibold">Instagram AI</button>
          <nav className="hidden gap-5 text-sm text-white/50 md:flex">
            <button onClick={() => go("/dashboard")} className="text-white">Dashboard</button>
            <button onClick={() => go("/content")}>Content</button>
            <button onClick={() => go("/calendar")}>Calendar</button>
            <button onClick={() => go("/analytics")}>Analytics</button>
            <button onClick={() => go("/billing")}>Billing</button>
          </nav>
          <button onClick={() => go("/login")} className="flex items-center gap-2 text-sm text-white/50">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm text-white/40">Workspace</p>
            <h1 className="mt-1 text-3xl font-bold">Dashboard</h1>
          </div>
          <button onClick={connect} className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black">
            <Instagram size={18} /> Connect Instagram
          </button>
        </div>

        {notice && <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">{notice}</div>}

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="text-sm text-white/40">{label}</p>
              <p className="mt-2 text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">AI Content Studio</h2>
                <p className="mt-1 text-sm text-white/40">Describe a post, campaign or Reel idea.</p>
              </div>
              <Sparkles size={20} />
            </div>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="mt-6 min-h-36 w-full rounded-2xl border border-white/10 bg-black/20 p-4 outline-none" placeholder="Example: Create a Reel caption for a Miami fitness brand launching a summer challenge..." />
            <button disabled={loading} onClick={generate} className="mt-3 flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={17} /> : <Sparkles size={17} />}
              {loading ? "Generating..." : "Generate content"}
            </button>
            {result && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex justify-end">
                  <button onClick={copy} className="text-white/50 hover:text-white">{copied ? <Check size={17} /> : <Copy size={17} />}</button>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-6 text-white/80">{result}</p>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <h2 className="font-semibold">Quick actions</h2>
            <div className="mt-4 space-y-3">
              <button onClick={() => go("/content")} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 p-4 text-left hover:bg-white/5"><Plus size={18} /> New content</button>
              <button onClick={() => go("/calendar")} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 p-4 text-left hover:bg-white/5"><CalendarDays size={18} /> Content calendar</button>
              <button onClick={() => go("/analytics")} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 p-4 text-left hover:bg-white/5"><BarChart3 size={18} /> View analytics</button>
              <button onClick={() => go("/billing")} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 p-4 text-left hover:bg-white/5"><CreditCard size={18} /> Billing</button>
              <button onClick={() => setNotice("Workspace settings estará disponible en la siguiente versión.")} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 p-4 text-left hover:bg-white/5"><Settings size={18} /> Workspace settings</button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
