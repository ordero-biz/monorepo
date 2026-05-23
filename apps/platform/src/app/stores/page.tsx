import { redirect } from 'next/navigation';
import { StoresListPage } from '@/features/stores/StoresListPage';
import { hasAuthenticatedServerSession } from '@/lib/api/authPageGuard';

export default async function StoresPage() {
  if (!(await hasAuthenticatedServerSession())) {
    redirect('/sign-in');
  }

  return <StoresListPage />;
}
