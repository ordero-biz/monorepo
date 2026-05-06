'use client';

import { forwardRef } from 'react';
import {
  contentClassName,
  navClassName,
} from './sidebarNavigationStyles';
import type { SidebarNavigationContentProps } from './types';

export const SidebarNavigationContent = forwardRef<
  HTMLDivElement,
  SidebarNavigationContentProps
>(({ ariaLabel = 'Sidebar navigation', children }, ref) => (
  <div
    className={contentClassName}
    data-slot="sidebar-navigation-content"
    ref={ref}
  >
    <nav aria-label={ariaLabel} className={navClassName}>
      {children}
    </nav>
  </div>
));

SidebarNavigationContent.displayName = 'SidebarNavigationContent';
