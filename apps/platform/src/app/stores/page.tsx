import { redirect } from 'next/navigation';
import { StoresListPage } from '@/features/stores/list/StoresListPage';
import { hasAuthenticatedServerSession } from '@/lib/api/authPageGuard';
import { clientRoutes } from '@/lib/client/routes';

export default async function StoresPage() {
  if (!(await hasAuthenticatedServerSession())) {
    redirect(clientRoutes.signIn);
  }

  return <StoresListPage />;
}
