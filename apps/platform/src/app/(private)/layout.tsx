import type { ReactNode } from 'react';
import { PlatformSidebar } from '@/components/PlatformSidebar';

export default function PlatformLayout({ children }: { children: ReactNode }) {
  return <PlatformSidebar>{children}</PlatformSidebar>;
}
