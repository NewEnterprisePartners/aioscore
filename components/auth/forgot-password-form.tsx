"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { env } from "@/lib/env";

export function ForgotPasswordForm() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${env.appUrl}/reset-password`
    });
    setMessage(error ? error.message : "Password reset email sent.");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input type="email" required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      <button className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white">Send reset link</button>
    </form>
  );
}
