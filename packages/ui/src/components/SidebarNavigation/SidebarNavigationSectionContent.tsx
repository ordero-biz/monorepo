'use client';

import { forwardRef } from 'react';
import { sectionContentClassName } from './sidebarNavigationStyles';
import type { SidebarNavigationSectionContentProps } from './types';

export const SidebarNavigationSectionContent = forwardRef<
  HTMLDivElement,
  SidebarNavigationSectionContentProps
>(({ children }, ref) => (
  <div
    className={sectionContentClassName}
    data-slot="sidebar-navigation-section-content"
    ref={ref}
  >
    {children}
  </div>
));

SidebarNavigationSectionContent.displayName = 'SidebarNavigationSectionContent';
