import {PlatformSidebar} from '@/components/PlatformSidebar';

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PlatformSidebar>{children}</PlatformSidebar>;
}
