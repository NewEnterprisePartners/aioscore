import Link from "next/link";
import { HeroUrlForm } from "@/components/marketing/hero-url-form";

const pillars = [
  "AI Readability",
  "Generative Engine Optimization",
  "Technical AI Accessibility",
  "Entity Authority",
  "SEO Foundations"
];

const steps = [
  { title: "Submit your URL", desc: "Start with a domain, subdomain, or key landing page." },
  { title: "Get your AIO Score", desc: "Receive a structured AI visibility baseline in under a minute." },
  { title: "Prioritize improvements", desc: "Follow focused recommendations for GEO, AI inclusion, and SEO." }
];

export default function HomePage() {
  return (
    <div>
      <section className="gradient-hero border-b border-slate-200/70 py-20 sm:py-28">
        <div className="container-default text-center">
          <p className="mb-5 inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
            New category: AI Visibility Intelligence
          </p>
          <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
            Measure how visible your website is to AI.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg">
            Your AI Optimization Score for generative search, AI inclusion, and SEO. Built for teams that care about discoverability in the AI era.
          </p>
          <div className="mt-10">
            <HeroUrlForm />
          </div>
        </div>
      </section>

      <section className="container-default py-16">
        <h2 className="text-center text-2xl font-semibold tracking-tight">What your AIO Score measures</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {pillars.map((item) => (
            <div key={item} className="glass-card p-5 text-center text-sm font-medium text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="container-default py-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight">How it works</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="glass-card p-6">
              <p className="text-sm font-semibold text-brand-600">Step {i + 1}</p>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-default py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["AI Readability", 78],
            ["GEO", 64],
            ["Technical AI Accessibility", 72]
          ].map(([label, score]) => (
            <div key={label as string} className="glass-card p-6">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{score as number}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-default py-16">
        <div className="glass-card flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Start with a free scan</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Free includes one partial report. Upgrade to unlock full recommendations, benchmark snapshots, and action plans.
            </p>
          </div>
          <Link href="/register" className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
