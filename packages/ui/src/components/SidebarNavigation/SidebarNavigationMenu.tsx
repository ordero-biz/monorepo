'use client';

import { SidebarNavigationMenuItems } from './SidebarNavigationMenuItems';
import { getVisibleItems } from './sidebarNavigationUtils';
import type { SidebarNavigationMenuProps } from './types';

export const SidebarNavigationMenu = ({
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
        renderLink={renderLink}
      />
    </div>
  );
};
