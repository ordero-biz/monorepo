'use client';

import { forwardRef } from 'react';
import './sidebarNavigation.css';
import { shellClassName } from './sidebarNavigationStyles';
import type { SidebarNavigationProps } from './types';

export const SidebarNavigation = forwardRef<
  HTMLDivElement,
  SidebarNavigationProps
>(({ children, id }, ref) => (
  <aside
    className={shellClassName}
    data-slot="sidebar-navigation"
    id={id}
    ref={ref}
  >
    {children}
  </aside>
));

SidebarNavigation.displayName = 'SidebarNavigation';
