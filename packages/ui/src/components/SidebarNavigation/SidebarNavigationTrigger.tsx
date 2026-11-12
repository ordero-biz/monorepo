'use client';

import { Menu } from 'lucide-react';
import { IconButton } from '@/ui/components/IconButton';
import { cn } from '@/ui/lib/utils';
import { sidebarBreakpointClasses, triggerClassName } from './classNames';
import { DEFAULT_SIDEBAR_BREAKPOINT } from './constants';
import { useSidebarNavigation } from './SidebarNavigationProvider';
import type { SidebarNavigationTriggerProps } from './types';

/**
 * Opens the sidebar drawer on mobile, where the sidebar itself is hidden.
 * Place it in the page header; it is hidden from the mobile breakpoint up.
 */
export const SidebarNavigationTrigger = ({
  label = 'Open navigation',
}: SidebarNavigationTriggerProps) => {
  const {
    breakpoint = DEFAULT_SIDEBAR_BREAKPOINT,
    collapsible,
    drawerOpen,
    overlayId,
    setDrawerOpen,
  } = useSidebarNavigation();

  if (!collapsible) {
    return null;
  }

  return (
    <span
      className={cn(
        triggerClassName,
        sidebarBreakpointClasses[breakpoint].trigger
      )}
      data-slot="sidebar-navigation-trigger"
    >
      <IconButton
        aria-controls={drawerOpen === undefined ? undefined : overlayId}
        aria-expanded={drawerOpen === true}
        aria-haspopup="dialog"
        aria-label={label}
        onClick={() => setDrawerOpen(true)}
      >
        <Menu aria-hidden="true" />
      </IconButton>
    </span>
  );
};
