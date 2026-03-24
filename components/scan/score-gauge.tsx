export function ScoreGauge({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score));
  return (
    <div className="glass-card p-6">
      <p className="text-sm text-slate-500">Overall AIO Score</p>
      <p className="mt-2 text-5xl font-semibold tracking-tight">{score}</p>
      <div className="mt-4 h-3 rounded-full bg-slate-100">
        <div className="h-3 rounded-full bg-brand-600" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
