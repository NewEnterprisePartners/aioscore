import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardScanTable } from "@/components/dashboard/dashboard-scan-table";
import { LogoutButton } from "@/components/dashboard/logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) redirect("/login");

  const [{ data: profile }, { data: scans }, { data: sub }, { data: usage }] = await Promise.all([
    supabase.from("profiles").select("first_name,last_name,email_verified").eq("id", userData.user.id).maybeSingle(),
    supabase.from("scans").select("id,scan_url,scan_status,overall_score,created_at").eq("user_id", userData.user.id).order("created_at", { ascending: false }),
    supabase.from("subscriptions").select("plan,status,current_period_end").eq("user_id", userData.user.id).maybeSingle(),
    supabase.from("usage_limits").select("free_scans_used").eq("user_id", userData.user.id).maybeSingle()
  ]);

  const eligible = (usage?.free_scans_used ?? 0) < 1 || sub?.status === "active";

  return (
    <div className="container-default py-12 space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="glass-card p-5 md:col-span-2">
          <div className="flex items-center justify-between"><h1 className="text-xl font-semibold">Dashboard</h1><LogoutButton /></div>
          <p className="mt-2 text-sm text-slate-600">{profile?.first_name} {profile?.last_name}</p>
          <p className="text-sm text-slate-600">Email verified: {profile?.email_verified ? "Yes" : "No"}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-slate-500">Free scan usage</p>
          <p className="mt-2 text-2xl font-semibold">{usage?.free_scans_used ?? 0}/1</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-slate-500">Subscription</p>
          <p className="mt-2 text-2xl font-semibold capitalize">{sub?.status ?? "none"}</p>
        </div>
      </div>

      <div className="glass-card p-5 flex items-center justify-between">
        <p className="text-sm text-slate-600">Run a new scan if eligible, otherwise choose a plan to continue.</p>
        <Link href={eligible ? "/" : "/pricing"} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
          {eligible ? "Run New Scan" : "Upgrade"}
        </Link>
      </div>

      <DashboardScanTable scans={scans ?? []} />
    </div>
  );
}
