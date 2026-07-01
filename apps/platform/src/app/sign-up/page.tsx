import { redirect } from 'next/navigation';
import { AuthPageShell } from '@/features/auth/AuthPageShell';
import { SignUpLayout } from '@/features/sign-up/SignUpLayout';
import { clientRoutes } from '@/lib/client/routes';
import { hasAuthenticatedServerSession } from '@/lib/server/authPageGuard';

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
