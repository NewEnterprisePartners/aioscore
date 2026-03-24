import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ScoreGauge } from "@/components/scan/score-gauge";
import { CategoryCard } from "@/components/scan/category-card";
import { AssistantPanel } from "@/components/scan/assistant-panel";
import { ScanResultPayload } from "@/types";

const labels: Record<string, string> = {
  ai_readability: "AI Readability",
  geo: "GEO",
  technical_ai_accessibility: "Technical AI Accessibility",
  entity_authority: "Entity Authority",
  seo_foundations: "SEO Foundations"
};

export default async function ScanPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("email_verified").eq("id", userData.user.id).maybeSingle();
  if (!profile?.email_verified) redirect("/verify-email");

  const { data: scan } = await supabase
    .from("scans")
    .select("id,scan_url,overall_score,partial_access,user_id")
    .eq("id", params.id)
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (!scan) redirect("/dashboard");

  const { data: result } = await supabase.from("scan_results").select("result_json").eq("scan_id", params.id).maybeSingle();
  const report = result?.result_json as ScanResultPayload;
  const locked = scan.partial_access;

  return (
    <div className="container-default py-12 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">AIO Report</h1>
          <p className="text-sm text-slate-600">{scan.scan_url}</p>
        </div>
        {locked ? <Link href="/pricing" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Unlock the full AIO Report</Link> : null}
      </div>
      <ScoreGauge score={scan.overall_score ?? 0} />
      <p className="glass-card p-5 text-sm text-slate-700">{report.summary}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(report.categories).map(([key, value]) => (
          <CategoryCard key={key} title={labels[key]} result={value} locked={locked} />
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold">Competitor Benchmarking</h3>
        <ul className={locked ? "mt-3 blur-[2px] select-none" : "mt-3"}>
          {report.competitorBenchmark.map((line) => (
            <li key={line} className="text-sm text-slate-600">• {line}</li>
          ))}
        </ul>
      </div>

      <AssistantPanel />
    </div>
  );
}
