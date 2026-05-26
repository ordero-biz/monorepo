import { redirect } from 'next/navigation';
import { AddStorePage } from '@/features/stores/add/AddStorePage';
import { hasAuthenticatedServerSession } from '@/lib/api/authPageGuard';
import { clientRoutes } from '@/lib/client/routes';

export default async function AddStoreRoutePage() {
  if (!(await hasAuthenticatedServerSession())) {
    redirect(clientRoutes.signIn);
  }

  return <AddStorePage />;
}
