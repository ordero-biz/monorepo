'use client';

import {
  SidebarNavigation,
  SidebarNavigationBrand,
  SidebarNavigationContent,
  SidebarNavigationFooter,
  SidebarNavigationHeader,
  SidebarNavigationMenu,
  SidebarNavigationSections,
} from '@ordero/ui';
import { Building2, LogOut } from 'lucide-react';
import { useLogOut } from '@/lib/hooks/auth/useLogOut';
import { sidebarSections } from './sidebarSections';

export const Sidebar = () => {
  const { isLoggingOut, logOut } = useLogOut();

  return (
    <SidebarNavigation id="platform-sidebar">
      <SidebarNavigationHeader>
        <SidebarNavigationBrand logo={<Building2 />} title="Ordero" />
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
