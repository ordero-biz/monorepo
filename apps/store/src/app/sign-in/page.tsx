import { redirect } from 'next/navigation';
import { AuthPageShell } from '@/features/auth/AuthPageShell';
import { SignInFormLayout } from '@/features/sign-in/SignInLayout';
import { hasAuthenticatedServerSession } from '@/lib/api/authPageGuard';
import { clientRoutes } from '@/lib/routes';

export default async function SignInPage() {
  if (await hasAuthenticatedServerSession()) {
    redirect(clientRoutes.home);
  }

  return (
    <AuthPageShell>
      <SignInFormLayout />
    </AuthPageShell>
  );
}
