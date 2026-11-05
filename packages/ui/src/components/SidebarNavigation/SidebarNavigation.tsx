'use client';

import './styles.css';
import { Tooltip } from '@base-ui/react/tooltip';
import { shellClassName, shellInnerClassName } from './classNames';
import { useSidebarNavigation } from './SidebarNavigationProvider';
import { SidebarNavigationToggle } from './SidebarNavigationToggle';
import type { SidebarNavigationProps } from './types';

export const SidebarNavigation = ({
  children,
  id,
  ref,
}: SidebarNavigationProps) => {
  const { collapsed } = useSidebarNavigation();

  return (
    <Tooltip.Provider delay={0}>
      <aside
        className={shellClassName}
        data-collapsed={collapsed ? 'true' : 'false'}
        data-slot="sidebar-navigation"
        id={id}
        ref={ref}
      >
        <div className={shellInnerClassName}>{children}</div>
        <SidebarNavigationToggle controls={id} />
      </aside>
    </Tooltip.Provider>
  );
};
