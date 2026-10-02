import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.035] p-8">
        <Link href="/" className="text-sm text-white/50">← Back</Link>
        <h1 className="mt-8 text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-white/50">Authentication will be connected in the next build step.</p>
        <div className="mt-8 space-y-3">
          <input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none" placeholder="Email" type="email"/>
          <input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none" placeholder="Password" type="password"/>
          <Link href="/dashboard" className="block w-full rounded-xl bg-white px-4 py-3 text-center font-semibold text-black">Continue</Link>
        </div>
      </div>
    </main>
  );
}
