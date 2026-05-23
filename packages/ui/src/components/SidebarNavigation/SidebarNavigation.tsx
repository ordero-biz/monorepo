'use client';

import './styles.css';
import { shellClassName } from './classNames';
import type { SidebarNavigationProps } from './types';

export const SidebarNavigation = ({
  children,
  id,
  ref,
}: SidebarNavigationProps) => (
  <aside
    className={shellClassName}
    data-slot="sidebar-navigation"
    id={id}
    ref={ref}
  >
    {children}
  </aside>
);
