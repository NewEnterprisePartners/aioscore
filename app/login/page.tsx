import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" description="Log in to access scans, reports, and account settings.">
      <LoginForm />
    </AuthShell>
  );
}
