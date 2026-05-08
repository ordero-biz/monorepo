'use client';

import { headerClassName } from './sidebarNavigationStyles';
import type { SidebarNavigationHeaderProps } from './types';

export const SidebarNavigationHeader = ({
  children,
}: SidebarNavigationHeaderProps) => (
  <header
    className={headerClassName}
    data-slot="sidebar-navigation-header"
  >
    {children}
  </header>
);
