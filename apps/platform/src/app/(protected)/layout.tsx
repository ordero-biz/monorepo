import { SIDEBAR_NAVIGATION_COLLAPSED_COOKIE_NAME } from '@ordero/ui';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import { BaseLayout } from '@/features/app-shell';
import { requireAuthenticatedRoute } from '@/lib/server/authPageGuard';

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  await requireAuthenticatedRoute();

  const cookieStore = await cookies();
  const isInitialSidebarCollapsed =
    cookieStore.get(SIDEBAR_NAVIGATION_COLLAPSED_COOKIE_NAME)?.value === 'true';

  return (
    <BaseLayout isInitialSidebarCollapsed={isInitialSidebarCollapsed}>
      {children}
    </BaseLayout>
  );
}
