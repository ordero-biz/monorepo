import { redirect } from 'next/navigation';
import { AuthPageShell } from '@/features/auth/AuthPageShell';
import { SignUpLayout } from '@/features/sign-up/SignUpLayout';
import { hasAuthenticatedServerSession } from '@/lib/api/authPageGuard';
import { clientRoutes } from '@/lib/client/routes';

export default async function SignUpPage() {
  if (await hasAuthenticatedServerSession()) {
    redirect(clientRoutes.home);
  }

  return (
    <AuthPageShell>
      <SignUpLayout />
    </AuthPageShell>
  );
}
