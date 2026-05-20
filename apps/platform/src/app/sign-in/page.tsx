import { redirect } from 'next/navigation';
import { AuthPageShell } from '@/features/auth/AuthPageShell';
import { SignInFormLayout } from '@/features/sign-in/SignInLayout';
import { hasAuthenticatedServerSession } from '@/lib/api/authPageGuard';

export default async function SignInPage() {
  if (await hasAuthenticatedServerSession()) {
    redirect('/');
  }

  return (
    <AuthPageShell>
      <SignInFormLayout />
    </AuthPageShell>
  );
}
