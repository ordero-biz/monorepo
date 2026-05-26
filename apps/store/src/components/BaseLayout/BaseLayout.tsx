import { TopBar, Typography } from '@ordero/ui';
import { StoreSidebar } from '@/components/StoreSidebar/StoreSidebar';
import { BaseLayoutBox } from '../BaseLayoutBox/BaseLayoutBox';
import type { BaseLayoutProps } from './types';

export const BaseLayout = ({ children }: BaseLayoutProps) => (
  <div className="mx-auto flex min-h-screen w-full">
    <StoreSidebar />
    <main className="flex w-full flex-col">
      <TopBar.Root id="store-page-header">
        <TopBar.Left>
          <Typography variant="h6">Store</Typography>
        </TopBar.Left>
      </TopBar.Root>
      <BaseLayoutBox>{children}</BaseLayoutBox>
    </main>
  </div>
);
