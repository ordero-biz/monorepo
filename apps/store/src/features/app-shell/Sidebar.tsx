'use client';

import {
  SidebarNavigation,
  SidebarNavigationContent,
  SidebarNavigationFooter,
  SidebarNavigationHeader,
  SidebarNavigationMenu,
  SidebarNavigationSections,
} from '@ordero/ui';
import { LogOut, Package } from 'lucide-react';
import { useLogOut } from '@/lib/hooks/auth/useLogOut';
import { sidebarSections } from './sidebarSections';

export const Sidebar = () => {
  const { isLoggingOut, logOut } = useLogOut();

  return (
    <SidebarNavigation id="store-sidebar">
      <SidebarNavigationHeader>
        <div className="flex items-center gap-[var(--space-1)] px-[var(--space-1-5)]">
          <div className="flex size-[32px] items-center justify-center rounded-[var(--radius-50-token)] bg-primary text-primary-foreground">
            <Package className="size-4" />
          </div>
          <span className="text-[length:var(--subtitle1-size-desktop)] leading-[var(--subtitle1-line-height-desktop)] font-[var(--subtitle1-weight)] text-[var(--text-primary)]">
            Ordero
          </span>
        </div>
      </SidebarNavigationHeader>
      <SidebarNavigationContent>
        <SidebarNavigationSections sections={sidebarSections} />
      </SidebarNavigationContent>
      <SidebarNavigationFooter>
        <SidebarNavigationMenu
          ariaLabel="Account actions"
          items={[
            {
              disabled: isLoggingOut,
              icon: <LogOut aria-hidden="true" />,
              id: 'logout',
              kind: 'action',
              label: isLoggingOut ? 'Signing out' : 'Sign out',
              onSelect: logOut,
            },
          ]}
        />
      </SidebarNavigationFooter>
    </SidebarNavigation>
  );
};
