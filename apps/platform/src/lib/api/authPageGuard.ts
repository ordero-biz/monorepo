import { hasAuthenticatedServerSession as resolveAuthenticatedServerSession } from '@ordero/next-api/authPageGuard';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/api/session';
import { clientRoutes } from '@/lib/client/routes';

export const hasAuthenticatedServerSession = async () => {
  return resolveAuthenticatedServerSession({
    getServerSession,
  });
};

export const requireAuthenticatedRoute = async () => {
  if (!(await hasAuthenticatedServerSession())) {
    redirect(clientRoutes.signIn);
  }
};
