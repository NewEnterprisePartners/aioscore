import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { checkFreeScanEligibility } from "@/lib/usage";
import { generateScanResult } from "@/lib/scan-service";

const bodySchema = z.object({ url: z.string().url() });

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Provide a valid URL." }, { status: 400 });

  if (!user) {
    const eligibility = await checkFreeScanEligibility();
    if (!eligibility.eligible) {
      return NextResponse.json({ error: "Free usage exceeded. Please create an account or upgrade.", redirectTo: "/pricing" }, { status: 403 });
    }
    return NextResponse.json({ error: "Please create an account or log in to continue.", redirectTo: "/register" }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("email_verified").eq("id", user.id).maybeSingle();
  if (!profile?.email_verified) {
    return NextResponse.json({ error: "Verify your email before viewing scan results.", redirectTo: "/verify-email" }, { status: 403 });
  }

  const eligibility = await checkFreeScanEligibility(user.id);
  const { data: subscription } = await supabase.from("subscriptions").select("status").eq("user_id", user.id).maybeSingle();
  const hasPaid = subscription?.status === "active";

  if (!eligibility.eligible && !hasPaid) {
    return NextResponse.json({ error: "You used your free scan. Upgrade to unlock additional scans.", redirectTo: "/pricing" }, { status: 403 });
  }

  const report = await generateScanResult(parsed.data.url);
  const partialAccess = !hasPaid;

  const { data: scan, error: scanError } = await supabase
    .from("scans")
    .insert({
      user_id: user.id,
      scan_url: parsed.data.url,
      scan_status: "completed",
      overall_score: report.overallScore,
      partial_access: partialAccess,
      ip_address: eligibility.ip,
      device_id: eligibility.deviceId
    })
    .select("id")
    .single();

  if (scanError || !scan) {
    return NextResponse.json({ error: "Could not create scan." }, { status: 500 });
  }

  await supabase.from("scan_results").insert({
    scan_id: scan.id,
    result_json: report,
    section_scores: {
      ai_readability: report.categories.ai_readability.score,
      geo: report.categories.geo.score,
      technical_ai_accessibility: report.categories.technical_ai_accessibility.score,
      entity_authority: report.categories.entity_authority.score,
      seo_foundations: report.categories.seo_foundations.score
    }
  });

  await supabase.from("usage_limits").upsert(
    {
      user_id: user.id,
      ip_address: eligibility.ip,
      device_id: eligibility.deviceId,
      free_scans_used: hasPaid ? 0 : 1
    },
    { onConflict: "user_id" }
  );

  return NextResponse.json({ scanId: scan.id, redirectTo: `/scan/${scan.id}` });
}
