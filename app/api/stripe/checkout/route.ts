import { NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "@/lib/env";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const plan = searchParams.get("plan");

  if (!env.stripeSecretKey) {
    return NextResponse.redirect(`${origin}/pricing?billing=placeholder`);
  }

  const stripe = new Stripe(env.stripeSecretKey, { apiVersion: "2024-11-20.acacia" });
  const price = plan === "pro" ? env.stripeProPriceId : env.stripeStarterPriceId;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${origin}/dashboard?upgraded=true`,
    cancel_url: `${origin}/pricing?canceled=true`,
    line_items: [{ price, quantity: 1 }]
  });

  return NextResponse.redirect(session.url ?? `${origin}/pricing`);
}
