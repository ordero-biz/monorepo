'use client';

import { Menu } from 'lucide-react';
import { IconButton } from '@/ui/components/IconButton';
import { triggerClassName } from './classNames';
import { useSidebarNavigation } from './SidebarNavigationProvider';
import type { SidebarNavigationTriggerProps } from './types';

/**
 * Opens the sidebar drawer on mobile, where the sidebar itself is hidden.
 * Place it in the page header; it is hidden from the mobile breakpoint up.
 */
export const SidebarNavigationTrigger = ({
  label = 'Open navigation',
}: SidebarNavigationTriggerProps) => {
  const { collapsed, collapsible, isMobile, overlayId, setCollapsed } =
    useSidebarNavigation();
  const expanded = isMobile && !collapsed;

  if (!collapsible) {
    return null;
  }

  return (
    <span className={triggerClassName} data-slot="sidebar-navigation-trigger">
      <IconButton
        // The drawer stays mounted on mobile; on desktop there is none.
        aria-controls={isMobile ? overlayId : undefined}
        aria-expanded={expanded}
        aria-haspopup="dialog"
        aria-label={label}
        onClick={() => setCollapsed(false)}
      >
        <Menu aria-hidden="true" />
      </IconButton>
    </span>
  );
};
