'use client';

import { SidebarNavigationMenuItems } from './SidebarNavigationMenuItems';
import type { SidebarNavigationMenuProps } from './types';
import { getVisibleItems } from './utils';

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
    <SidebarNavigationMenuItems
      depth={0}
      items={visibleItems}
      rootLabel={ariaLabel ?? 'Sidebar navigation items'}
      renderLink={renderLink}
    />
  );
};
