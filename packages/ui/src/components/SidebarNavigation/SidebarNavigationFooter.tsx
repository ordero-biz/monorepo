'use client';

import { forwardRef } from 'react';
import { footerClassName } from './sidebarNavigationStyles';
import type { SidebarNavigationFooterProps } from './types';

export const SidebarNavigationFooter = forwardRef<
  HTMLDivElement,
  SidebarNavigationFooterProps
>(({ children }, ref) => (
  <div
    className={footerClassName}
    data-slot="sidebar-navigation-footer"
    ref={ref}
  >
    {children}
  </div>
));

SidebarNavigationFooter.displayName = 'SidebarNavigationFooter';
