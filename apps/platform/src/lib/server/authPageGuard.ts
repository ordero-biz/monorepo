import { hasAuthenticatedServerSession as resolveAuthenticatedServerSession } from '@ordero/next-api/authPageGuard';
import { redirect } from 'next/navigation';
import { clientRoutes } from '@/lib/client/routes';
import { getServerSession } from '@/lib/server/session';

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
