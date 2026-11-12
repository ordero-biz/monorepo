'use client';

import './styles.css';
import { Drawer } from '@base-ui/react/drawer';
import { Tooltip } from '@base-ui/react/tooltip';
import { type MouseEvent, useEffect, useRef } from 'react';
import { useBelowViewportBreakpoint } from '@/ui/hooks/useBelowViewportBreakpoint';
import { cn } from '@/ui/lib/utils';
import {
  overlayBackdropClassName,
  overlayPopupClassName,
  overlayViewportClassName,
  panelClassName,
  shellClassName,
  shellInnerClassName,
  sidebarBreakpointClasses,
} from './classNames';
import { DEFAULT_SIDEBAR_BREAKPOINT } from './constants';
import {
  SidebarNavigationDisplayScope,
  useSidebarNavigation,
} from './SidebarNavigationProvider';
import { SidebarNavigationToggle } from './SidebarNavigationToggle';
import type { SidebarNavigationProps } from './types';

// Leaf items only: links and actions. Branch triggers just expand a submenu.
const selectableItemSelector =
  'a[href], [data-slot="sidebar-navigation-action"]';

export const SidebarNavigation = ({
  children,
  collapseLabel = 'Collapse sidebar',
  expandLabel = 'Expand sidebar',
  id,
  label = 'Sidebar navigation',
  ref,
}: SidebarNavigationProps) => {
  const {
    breakpoint = DEFAULT_SIDEBAR_BREAKPOINT,
    collapsed,
    collapsible,
    drawerOpen,
    overlayId,
    setDrawerOpen,
  } = useSidebarNavigation();
  const isBelowBreakpoint = useBelowViewportBreakpoint(breakpoint);
  const showRail = !collapsible || !isBelowBreakpoint;
  const desktopToggleRef = useRef<HTMLButtonElement>(null);
  const closedOnDesktop = useRef(false);

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    closedOnDesktop.current = !isBelowBreakpoint;
    if (!isBelowBreakpoint) {
      setDrawerOpen(false);
    }
  }, [drawerOpen, isBelowBreakpoint, setDrawerOpen]);

  // Close the drawer once an item is selected. React events bubble through
  // portals, so this also covers links inside nested popovers.
  const handleOverlayClick = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as Element).closest(selectableItemSelector)) {
      setDrawerOpen(false);
    }
  };

  return (
    <Tooltip.Provider delay={0}>
      <aside
        aria-label={label}
        className={cn(
          shellClassName,
          collapsible && sidebarBreakpointClasses[breakpoint].rail
        )}
        data-collapsed={collapsed ? 'true' : 'false'}
        data-slot="sidebar-navigation"
        id={id}
        ref={ref}
      >
        {showRail && (
          <div className={panelClassName} data-slot="sidebar-navigation-rail">
            <div className={shellInnerClassName}>{children}</div>
            <SidebarNavigationToggle
              collapseLabel={collapseLabel}
              controls={id}
              expandLabel={expandLabel}
              ref={desktopToggleRef}
            />
          </div>
        )}
      </aside>
      {collapsible ? (
        <Drawer.Root
          onOpenChange={setDrawerOpen}
          open={drawerOpen === true}
          swipeDirection="left"
        >
          {/* Mount the content on first open and retain expanded branches afterward. */}
          <Drawer.Portal keepMounted={drawerOpen !== undefined}>
            <Drawer.Backdrop
              className={overlayBackdropClassName}
              data-slot="sidebar-navigation-backdrop"
            />
            <Drawer.Viewport className={overlayViewportClassName}>
              <Drawer.Popup
                aria-label={label}
                className={overlayPopupClassName}
                data-collapsed="false"
                data-slot="sidebar-navigation-overlay"
                finalFocus={() =>
                  closedOnDesktop.current ? desktopToggleRef.current : true
                }
                id={overlayId}
                onClick={handleOverlayClick}
              >
                <div className={shellInnerClassName}>
                  <SidebarNavigationDisplayScope
                    renderCollapsed={false}
                    sectionIdPrefix={overlayId}
                  >
                    {children}
                  </SidebarNavigationDisplayScope>
                </div>
              </Drawer.Popup>
            </Drawer.Viewport>
          </Drawer.Portal>
        </Drawer.Root>
      ) : null}
    </Tooltip.Provider>
  );
};
