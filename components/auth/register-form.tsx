"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { env } from "@/lib/env";

export function RegisterForm() {
  const supabase = createClient();
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    marketing: false
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) return setError("Passwords must match.");
    if (!form.acceptTerms) return setError("You must accept Terms and Privacy Policy.");

    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${env.appUrl}/verify-email`,
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
          accepted_terms_at: new Date().toISOString(),
          marketing_opt_in: form.marketing,
          newsletter_opt_in: form.marketing
        }
      }
    });
    setLoading(false);

    if (authError) return setError(authError.message);
    router.push("/verify-email?status=sent");
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="grid grid-cols-2 gap-3">
        <input required className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="First name" value={form.firstName} onChange={(e) => setForm((s) => ({ ...s, firstName: e.target.value }))} />
        <input required className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Last name" value={form.lastName} onChange={(e) => setForm((s) => ({ ...s, lastName: e.target.value }))} />
      </div>
      <input required type="email" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
      <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
      <input required type="password" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} />
      <input required type="password" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Confirm password" value={form.confirmPassword} onChange={(e) => setForm((s) => ({ ...s, confirmPassword: e.target.value }))} />
      <label className="flex items-start gap-2 text-sm text-slate-600"><input type="checkbox" checked={form.acceptTerms} onChange={(e) => setForm((s) => ({ ...s, acceptTerms: e.target.checked }))} className="mt-0.5" />I agree to the <Link href="/terms" className="underline">Terms and Conditions</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.</label>
      <label className="flex items-start gap-2 text-sm text-slate-600"><input type="checkbox" checked={form.marketing} onChange={(e) => setForm((s) => ({ ...s, marketing: e.target.checked }))} className="mt-0.5" />I agree to receive the AIOScore AI Tips & Trends newsletter, product updates, and marketing communications.</label>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <button disabled={loading} className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white">{loading ? "Creating account..." : "Create account"}</button>
    </form>
  );
}
