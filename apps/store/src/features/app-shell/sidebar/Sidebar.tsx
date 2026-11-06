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
import { LogOut, Package } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useLogOut } from '@/lib/hooks/auth/useLogOut';
import { SidebarLink } from './SidebarLink';
import { sidebarSections } from './sidebarSections';
import { getSidebarSections } from './utils';

export const Sidebar = () => {
  const { isLoggingOut, logOut } = useLogOut();
  const pathname = usePathname();
  const sections = getSidebarSections({ pathname, sections: sidebarSections });

  return (
    <SidebarNavigation id="store-sidebar">
      <SidebarNavigationHeader>
        <SidebarNavigationBrand logo={<Package />} title="Ordero" />
      </SidebarNavigationHeader>
      <SidebarNavigationContent>
        <SidebarNavigationSections
          renderLink={SidebarLink}
          sections={sections}
        />
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
