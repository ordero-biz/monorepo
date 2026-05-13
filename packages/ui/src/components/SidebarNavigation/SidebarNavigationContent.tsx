'use client';

import {
  contentClassName,
  navClassName,
} from './classNames';
import type { SidebarNavigationContentProps } from './types';

export const SidebarNavigationContent = ({
  ariaLabel = 'Sidebar navigation',
  children,
}: SidebarNavigationContentProps) => (
  <div
    className={contentClassName}
    data-slot="sidebar-navigation-content"
  >
    <nav aria-label={ariaLabel} className={navClassName}>
      {children}
    </nav>
  </div>
);
