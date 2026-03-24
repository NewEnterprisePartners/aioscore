import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Set new password" description="Choose a strong password for your account.">
      <ResetPasswordForm />
    </AuthShell>
  );
}
