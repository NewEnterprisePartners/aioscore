export function AuthShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="container-default py-16">
      <div className="mx-auto w-full max-w-lg glass-card p-8">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
