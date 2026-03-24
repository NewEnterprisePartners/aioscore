"use client";

import { useState } from "react";

export function AssistantPanel() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });
    const data = await response.json();
    setLoading(false);
    setAnswer(data.answer ?? "No response available.");
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold">Member AI Assistant</h3>
      <p className="mt-1 text-sm text-slate-600">Ask for help interpreting your AIO report and prioritizing actions.</p>
      <form className="mt-4 space-y-3" onSubmit={ask}>
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} required className="h-24 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="What should we improve first for GEO?" />
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" disabled={loading}>{loading ? "Thinking..." : "Ask Assistant"}</button>
      </form>
      {answer ? <p className="mt-4 rounded-xl bg-slate-100 p-4 text-sm text-slate-700">{answer}</p> : null}
    </div>
  );
}
