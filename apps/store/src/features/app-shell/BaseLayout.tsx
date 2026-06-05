import { cn, TopBar, Typography } from '@ordero/ui';
import { Sidebar } from './Sidebar';
import type { BaseLayoutProps } from './types';

const baseLayoutContentClassName = cn(
  'bg-background box-border mx-auto w-full max-w-full px-3 py-1',
  'sm:max-w-[var(--breakpoint-sm-token)] sm:px-4',
  'md:max-w-[var(--breakpoint-md-token)] md:px-5',
  'lg:max-w-[var(--breakpoint-lg-token)] lg:px-6',
  'xl:max-w-[var(--breakpoint-xl-token)] xl:px-7'
);

export const BaseLayout = ({ children }: BaseLayoutProps) => (
  <div className="mx-auto flex min-h-screen w-full">
    <Sidebar />
    <main className="flex min-w-0 flex-1 flex-col">
      <TopBar.Root id="store-page-header">
        <TopBar.Left>
          <Typography variant="h6">Store</Typography>
        </TopBar.Left>
      </TopBar.Root>
      <section className={baseLayoutContentClassName}>{children}</section>
    </main>
  </div>
);
