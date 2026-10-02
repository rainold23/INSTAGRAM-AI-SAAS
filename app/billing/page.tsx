"use client";
import { useState } from "react";

export default function BillingPage(){
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  async function checkout(){
    setLoading(true); setError("");
    const r=await fetch("/api/billing/checkout",{method:"POST"});
    const d=await r.json();
    if(d.url) window.location.href=d.url; else setError(d.error||"No se pudo iniciar el pago.");
    setLoading(false);
  }
  return <main className="min-h-screen bg-[#08090d] text-white"><div className="mx-auto max-w-3xl px-6 py-12"><a href="/dashboard" className="text-sm text-white/40">← Dashboard</a><h1 className="mt-8 text-4xl font-bold">Plan y facturación</h1><p className="mt-2 text-white/50">Gestiona la suscripción de este workspace.</p><div className="mt-8 rounded-3xl border border-white/10 bg-white/[.035] p-7"><p className="text-sm text-white/40">Plan profesional</p><p className="mt-2 text-4xl font-bold">Tu precio</p><p className="mt-3 text-white/50">El precio final se configura en Stripe mediante STRIPE_PRICE_ID.</p>{error&&<p className="mt-4 text-sm text-red-300">{error}</p>}<button onClick={checkout} disabled={loading} className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-black disabled:opacity-50">{loading?"Redirigiendo…":"Suscribirme"}</button></div></div></main>;
}
