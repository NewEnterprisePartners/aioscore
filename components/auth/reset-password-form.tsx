"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) return setMessage("Passwords do not match.");
    const { error } = await supabase.auth.updateUser({ password });
    setMessage(error ? error.message : "Password updated. You can now log in.");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input type="password" required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="password" required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      <button className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white">Update password</button>
    </form>
  );
}
