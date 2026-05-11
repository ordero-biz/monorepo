'use client';

import { footerClassName } from './classNames';
import type { SidebarNavigationFooterProps } from './types';

export const SidebarNavigationFooter = ({
  children,
}: SidebarNavigationFooterProps) => (
  <footer
    className={footerClassName}
    data-slot="sidebar-navigation-footer"
  >
    {children}
  </footer>
);
