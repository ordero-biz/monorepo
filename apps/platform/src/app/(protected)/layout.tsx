import type { ReactNode } from 'react';
import { requireAuthenticatedRoute } from '@/lib/api/authPageGuard';

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  await requireAuthenticatedRoute();

  return children;
}
