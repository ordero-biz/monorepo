import { redirect } from 'next/navigation';
import { AuthPageShell } from '@/features/auth/AuthPageShell';
import { SignInFormLayout } from '@/features/sign-in/SignInLayout';
import { hasAuthenticatedServerSession } from '@/lib/api/authPageGuard';
import { clientRoutes } from '@/lib/client/routes';

export default async function SignInPage() {
  if (await hasAuthenticatedServerSession()) {
    redirect(clientRoutes.stores);
  }

  return (
    <AuthPageShell>
      <SignInFormLayout />
    </AuthPageShell>
  );
}
