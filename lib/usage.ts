import { cookies, headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function getRequestIp() {
  const h = headers();
  const forwarded = h.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

export async function getDeviceId() {
  const cookieStore = cookies();
  let deviceId = cookieStore.get("aio_device_id")?.value;
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    cookieStore.set("aio_device_id", deviceId, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  return deviceId;
}

export async function checkFreeScanEligibility(userId?: string) {
  const supabase = await createClient();
  const ip = await getRequestIp();
  const deviceId = await getDeviceId();

  // Basic starter anti-abuse logic. TODO: harden with rate limits, fingerprinting, and anomaly detection.
  const { data: usage } = await supabase
    .from("usage_limits")
    .select("free_scans_used")
    .or(`user_id.eq.${userId ?? ""},ip_address.eq.${ip},device_id.eq.${deviceId}`)
    .maybeSingle();

  return {
    eligible: (usage?.free_scans_used ?? 0) < 1,
    ip,
    deviceId
  };
}
