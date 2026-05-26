import { TopBar, Typography } from '@ordero/ui';
import { StoreSidebar } from '@/components/StoreSidebar/StoreSidebar';
import { StoreBaseLayoutBox } from '../StoreBaseLayoutBox/StoreBaseLayoutBox';
import type { StoreBaseLayoutProps } from './types';

export const StoreBaseLayout = ({ children }: StoreBaseLayoutProps) => (
  <div className="mx-auto flex min-h-screen w-full">
    <StoreSidebar />
    <main className="flex w-full flex-col">
      <TopBar.Root id="store-page-header">
        <TopBar.Left>
          <Typography variant="h6">Store</Typography>
        </TopBar.Left>
      </TopBar.Root>
      <StoreBaseLayoutBox>{children}</StoreBaseLayoutBox>
    </main>
  </div>
);
