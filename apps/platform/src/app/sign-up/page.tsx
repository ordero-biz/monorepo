import { AuthPageShell } from '@/features/auth/AuthPageShell';
import { SignUpLayout } from '@/features/sign-up/SignUpLayout';

export default function SignUpPage() {
  return (
    <AuthPageShell>
      <SignUpLayout />
    </AuthPageShell>
  );
}
