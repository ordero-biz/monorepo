'use client';

import { SidebarNavigationMenuItems } from './SidebarNavigationMenuItems';
import { getVisibleItems } from './sidebarNavigationUtils';
import type { SidebarNavigationMenuProps } from './types';

export const SidebarNavigationMenu = ({
  ariaLabel,
  items,
  renderLink,
}: SidebarNavigationMenuProps) => {
  const visibleItems = getVisibleItems(items);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div data-slot="sidebar-navigation-menu">
      <SidebarNavigationMenuItems
        depth={0}
        items={visibleItems}
        rootLabel={ariaLabel ?? 'Sidebar navigation items'}
        renderLink={renderLink}
      />
    </div>
  );
};
