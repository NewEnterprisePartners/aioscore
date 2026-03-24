"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HeroUrlForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to start scan");
      router.push(data.redirectTo ?? `/scan/${data.scanId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-3xl">
      <div className="glass-card flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <input
          type="url"
          required
          placeholder="https://yourdomain.com"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          className="h-12 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none ring-brand-500 placeholder:text-slate-400 focus:ring"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Analyzing..." : "Check My AIO Score"}
        </button>
      </div>
      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
    </form>
  );
}
