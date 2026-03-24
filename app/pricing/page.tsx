import Link from "next/link";

const tiers = [
  { name: "Free", price: "$0", details: "1 scan • partial results", cta: "Get started", href: "/register" },
  { name: "Starter", price: "$19/mo", details: "Full reports • more scans", cta: "Start Starter", href: "/api/stripe/checkout?plan=starter" },
  { name: "Pro / Agency", price: "$99/mo", details: "Team workflows • higher limits", cta: "Start Pro", href: "/api/stripe/checkout?plan=pro" }
];

export default function PricingPage() {
  return (
    <div className="container-default py-16">
      <h1 className="text-center text-4xl font-semibold tracking-tight">Pricing</h1>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-600">Simple plans to monitor AI visibility and unlock full AIO reports.</p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <div key={tier.name} className="glass-card p-6">
            <h2 className="text-lg font-semibold">{tier.name}</h2>
            <p className="mt-2 text-3xl font-semibold">{tier.price}</p>
            <p className="mt-2 text-sm text-slate-600">{tier.details}</p>
            <Link href={tier.href} className="mt-6 inline-flex rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">{tier.cta}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
