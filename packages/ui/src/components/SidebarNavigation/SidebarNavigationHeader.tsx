'use client';

import { headerClassName } from './classNames';
import type { SidebarNavigationHeaderProps } from './types';

export const SidebarNavigationHeader = ({
  children,
}: SidebarNavigationHeaderProps) => (
  <header className={headerClassName} data-slot="sidebar-navigation-header">
    {children}
  </header>
);
