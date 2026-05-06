'use client';

import { forwardRef } from 'react';
import { headerClassName } from './sidebarNavigationStyles';
import type { SidebarNavigationHeaderProps } from './types';

export const SidebarNavigationHeader = forwardRef<
  HTMLDivElement,
  SidebarNavigationHeaderProps
>(({ children }, ref) => (
  <div
    className={headerClassName}
    data-slot="sidebar-navigation-header"
    ref={ref}
  >
    {children}
  </div>
));

SidebarNavigationHeader.displayName = 'SidebarNavigationHeader';
