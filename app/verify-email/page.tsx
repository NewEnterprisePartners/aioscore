import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="container-default py-16">
      <div className="mx-auto max-w-xl glass-card p-8 text-center">
        <h1 className="text-2xl font-semibold">Verify your email</h1>
        <p className="mt-3 text-sm text-slate-600">Check your inbox and click the verification link before viewing AIO report results.</p>
        <Link href="/login" className="mt-6 inline-flex rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Go to login</Link>
      </div>
    </div>
  );
}
