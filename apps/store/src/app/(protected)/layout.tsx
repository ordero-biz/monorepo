import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { hasAuthenticatedServerSession } from '@/lib/api/authPageGuard';

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  if (!(await hasAuthenticatedServerSession())) {
    redirect('/sign-in');
  }

  return <BaseLayout>{children}</BaseLayout>;
}
