import { redirect } from 'next/navigation';
import { AuthPageShell } from '@/features/auth/AuthPageShell';
import { SignInFormLayout } from '@/features/sign-in/SignInLayout';
import { clientRoutes } from '@/lib/client/routes';
import { hasAuthenticatedServerSession } from '@/lib/server/authPageGuard';

export default async function SignInPage() {
  if (await hasAuthenticatedServerSession()) {
    redirect(clientRoutes.attributes);
  }

  return (
    <AuthPageShell>
      <SignInFormLayout />
    </AuthPageShell>
  );
}
