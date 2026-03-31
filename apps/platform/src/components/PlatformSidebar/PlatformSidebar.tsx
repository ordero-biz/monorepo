'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@ordero/ui';
import { HomeIcon, LayoutDashboardIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type PlatformSidebarProps = {
  children: ReactNode;
  title?: string;
};

export function PlatformSidebar({ children, title }: PlatformSidebarProps) {
  const pathname = usePathname();
  const isDashboardActive = pathname === '/dashboard';

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex min-h-11 items-center px-2 group-data-[icon-state=collapsed]:justify-center group-data-[icon-state=collapsed]:px-0">
            <div className="hidden text-primary group-data-[icon-state=collapsed]:block">
              <p className="text-4xl font-semibold leading-none">O</p>
            </div>
            <div className="min-w-0 group-data-[icon-state=collapsed]:hidden">
              <p className="text-4xl font-semibold leading-none text-primary">
                Ordero
              </p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/dashboard" />}
                  isActive={isDashboardActive}
                >
                  <LayoutDashboardIcon />
                  <span className="group-data-[icon-state=collapsed]:hidden">
                    Dashboard
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/" />}
                  isActive={!isDashboardActive}
                >
                  <HomeIcon />
                  <span className="group-data-[icon-state=collapsed]:hidden">
                    Root
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-h-svh">
        {/*TODO: Create Header component*/}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 md:h-16 md:px-6">
          {title && (
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-[-0.01em] text-foreground md:text-xl">
                {title}
              </h1>
            </div>
          )}
        </header>
        {/*TODO: Create Paper component*/}
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
