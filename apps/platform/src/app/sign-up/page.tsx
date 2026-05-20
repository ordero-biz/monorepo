import { AuthPageShell } from '@/features/auth/AuthPageShell';
import { SignUpLayout } from '@/features/sign-up/SignUpLayout';
import { hasAuthenticatedServerSession } from '@/lib/api/authPageGuard';
import { redirect } from 'next/navigation';

export default async function SignUpPage() {
  if (await hasAuthenticatedServerSession()) {
    redirect('/');
  }

  return (
    <AuthPageShell>
      <SignUpLayout />
    </AuthPageShell>
  );
}
