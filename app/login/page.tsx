"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage(){
  const [mode,setMode]=useState<"signin"|"signup">("signin");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function submit(e:React.FormEvent){
    e.preventDefault(); setError(""); setLoading(true);
    try {
      if(mode==="signup"){
        const r=await fetch("/api/auth/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,password})});
        const d=await r.json();
        if(!r.ok) throw new Error(d.error||"No se pudo crear la cuenta.");
      }
      const result=await signIn("credentials",{email,password,redirect:false});
      if(result?.error) throw new Error("Email o contraseña incorrectos.");
      window.location.href="/dashboard";
    } catch(err) {
      setError(err instanceof Error?err.message:"No se pudo completar la operación.");
    } finally { setLoading(false); }
  }

  return <main className="flex min-h-screen items-center justify-center px-6 py-10">
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.035] p-8">
      <Link href="/" className="text-sm text-white/50">← Back</Link>
      <h1 className="mt-8 text-3xl font-bold">{mode==="signin"?"Welcome back":"Create your workspace"}</h1>
      <p className="mt-2 text-white/50">{mode==="signin"?"Sign in to manage your Instagram workspace.":"Start your Instagram AI workspace."}</p>
      <form onSubmit={submit} className="mt-8 space-y-3">
        {mode==="signup"&&<input value={name} onChange={e=>setName(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none" placeholder="Full name"/>}
        <input value={email} onChange={e=>setEmail(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none" placeholder="Email" type="email"/>
        <input value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none" placeholder="Password" type="password"/>
        {error&&<div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</div>}
        <button disabled={loading} className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black disabled:opacity-50">{loading?"Please wait…":mode==="signin"?"Continue":"Create account"}</button>
      </form>
      <button onClick={()=>{setMode(mode==="signin"?"signup":"signin");setError("")}} className="mt-5 w-full text-sm text-white/50 hover:text-white">{mode==="signin"?"New here? Create an account":"Already have an account? Sign in"}</button>
    </div>
  </main>
}