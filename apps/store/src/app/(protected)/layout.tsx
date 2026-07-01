import type { ReactNode } from 'react';
import { BaseLayout } from '@/features/app-shell/BaseLayout';
import { requireAuthenticatedRoute } from '@/lib/server/authPageGuard';

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  await requireAuthenticatedRoute();

  return <BaseLayout>{children}</BaseLayout>;
}
