"use client";
import Link from "next/link";
import { useState } from "react";
export default function LoginPage(){
 const [mode,setMode]=useState<"signin"|"signup">("signin");
 return <main className="flex min-h-screen items-center justify-center px-6 py-10">
  <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.035] p-8">
   <Link href="/" className="text-sm text-white/50">← Back</Link>
   <h1 className="mt-8 text-3xl font-bold">{mode==="signin"?"Welcome back":"Create your workspace"}</h1>
   <p className="mt-2 text-white/50">{mode==="signin"?"Sign in to manage your Instagram workspace.":"Start your Instagram AI workspace."}</p>
   <div className="mt-8 space-y-3">
    <input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none" placeholder="Email" type="email"/>
    {mode==="signup"&&<input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none" placeholder="Full name"/>}
    <input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none" placeholder="Password" type="password"/>
    <Link href="/dashboard" className="block w-full rounded-xl bg-white px-4 py-3 text-center font-semibold text-black">{mode==="signin"?"Continue":"Create account"}</Link>
   </div>
   <button onClick={()=>setMode(mode==="signin"?"signup":"signin")} className="mt-5 w-full text-sm text-white/50 hover:text-white">{mode==="signin"?"New here? Create an account":"Already have an account? Sign in"}</button>
   <p className="mt-6 text-center text-xs text-white/30">Production authentication will be connected to your database provider before customer launch.</p>
  </div>
 </main>
}