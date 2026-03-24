"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setMessage(error.message);
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      {message ? <p className="text-sm text-rose-600">{message}</p> : null}
      <button disabled={loading} className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white">{loading ? "Signing in..." : "Login"}</button>
      <div className="flex justify-between text-sm text-slate-600">
        <Link href="/register" className="hover:text-slate-900">Create account</Link>
        <Link href="/forgot-password" className="hover:text-slate-900">Forgot password?</Link>
      </div>
    </form>
  );
}
