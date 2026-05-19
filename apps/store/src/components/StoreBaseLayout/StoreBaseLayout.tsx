import { TopBar, Typography } from '@ordero/ui';
import { StoreSidebar } from '@/components/StoreSidebar';
import { StoreBaseLayoutBox } from './StoreBaseLayoutBox';
import type { StoreBaseLayoutProps } from './types';

export const StoreBaseLayout = ({ children }: StoreBaseLayoutProps) => (
  <div className="min-h-screen bg-background text-foreground">
    <div className="mx-auto flex min-h-screen w-full">
      <StoreSidebar />
      <main className="flex w-full flex-col">
        <TopBar id="store-page-header">
          <TopBar.Left>
            <Typography variant="h6">Store</Typography>
          </TopBar.Left>
        </TopBar>
        <StoreBaseLayoutBox>{children}</StoreBaseLayoutBox>
      </main>
    </div>
  </div>
);
