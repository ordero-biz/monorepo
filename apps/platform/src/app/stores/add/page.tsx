import { redirect } from 'next/navigation';
import { AddStorePage } from '@/features/stores/AddStorePage';
import { hasAuthenticatedServerSession } from '@/lib/api/authPageGuard';

export default async function AddStoreRoutePage() {
  if (!(await hasAuthenticatedServerSession())) {
    redirect('/sign-in');
  }

  return <AddStorePage />;
}
