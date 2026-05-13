'use client';

import { sectionContentClassName } from './classNames';
import type { SidebarNavigationSectionContentProps } from './types';

export const SidebarNavigationSectionContent = ({
  children,
}: SidebarNavigationSectionContentProps) => (
  <section
    className={sectionContentClassName}
    data-slot="sidebar-navigation-section-content"
  >
    {children}
  </section>
);
