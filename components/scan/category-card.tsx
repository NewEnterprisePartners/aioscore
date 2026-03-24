import clsx from "clsx";
import { CategoryResult } from "@/types";

export function CategoryCard({ title, result, locked }: { title: string; result: CategoryResult; locked: boolean }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-xl font-semibold">{result.score}</span>
      </div>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
        {result.findings.slice(0, 3).map((finding) => (
          <li key={finding}>{finding}</li>
        ))}
      </ul>
      <div className={clsx("mt-4 rounded-xl border p-4", locked ? "border-slate-200 bg-slate-100/70" : "border-emerald-200 bg-emerald-50")}>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommendations</p>
        <ul className={clsx("mt-2 space-y-1 text-sm", locked && "blur-[2px] select-none")}>
          {result.recommendations.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
        {locked ? <p className="mt-3 text-xs font-semibold text-brand-700">Upgrade to unlock full recommendations.</p> : null}
      </div>
    </div>
  );
}
