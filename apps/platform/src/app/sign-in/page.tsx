import { AuthPageShell } from '@/features/auth/AuthPageShell';
import { SignInFormLayout } from '@/features/sign-in/SignInLayout';

export default function SignInPage() {
  return (
    <AuthPageShell>
      <SignInFormLayout />
    </AuthPageShell>
  );
}
