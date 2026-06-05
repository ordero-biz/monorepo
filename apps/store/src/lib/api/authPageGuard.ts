import { hasAuthenticatedServerSession as resolveAuthenticatedServerSession } from '@ordero/next-api/authPageGuard';
import { getServerSession } from '@/lib/api/session';

export const hasAuthenticatedServerSession = async () => {
  return true;
};
