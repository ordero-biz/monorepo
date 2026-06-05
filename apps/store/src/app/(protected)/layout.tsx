import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { hasAuthenticatedServerSession } from '@/lib/api/authPageGuard';
import { clientRoutes } from '@/lib/client/routes';

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  if (!(await hasAuthenticatedServerSession())) {
    redirect(clientRoutes.signIn);
  }

  return <BaseLayout>{children}</BaseLayout>;
}
