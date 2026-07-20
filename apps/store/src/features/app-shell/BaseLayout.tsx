import { cn, TopBar, Typography } from '@ordero/ui';
import { Sidebar } from './Sidebar';
import type { BaseLayoutProps } from './types';

const baseLayoutContentClassName = cn(
  'bg-background box-border mx-auto w-full max-w-full px-3 py-1',
  'sm:max-w-[var(--layout-container-sm)] sm:px-4',
  'md:max-w-[var(--layout-container-md)] md:px-5',
  'lg:max-w-[var(--layout-container-lg)] lg:px-6',
  'xl:max-w-[var(--layout-container-xl)] xl:px-7'
);

const baseLayoutMainClassName = cn(
  'flex min-w-0 flex-1 flex-col [--base-layout-content-max-width:100%] [--base-layout-main-offset:var(--nav-width)]',
  'sm:[--base-layout-content-max-width:var(--layout-container-sm)]',
  'md:[--base-layout-content-max-width:var(--layout-container-md)]',
  'lg:[--base-layout-content-max-width:var(--layout-container-lg)]',
  'xl:[--base-layout-content-max-width:var(--layout-container-xl)]'
);

export const BaseLayout = ({ children }: BaseLayoutProps) => (
  <div className="mx-auto flex min-h-screen w-full">
    <Sidebar />
    <main className={baseLayoutMainClassName}>
      <TopBar.Root id="store-page-header">
        <TopBar.Left>
          <Typography variant="h6">Store</Typography>
        </TopBar.Left>
      </TopBar.Root>
      <section className={baseLayoutContentClassName}>{children}</section>
    </main>
  </div>
);
