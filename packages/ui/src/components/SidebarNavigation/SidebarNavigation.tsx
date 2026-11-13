'use client';

import './styles.css';
import { Drawer } from '@base-ui/react/drawer';
import { Tooltip } from '@base-ui/react/tooltip';
import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IconButton } from '@/ui/components/IconButton';
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
import { useSidebarNavigation } from './SidebarNavigationProvider';
import { SidebarNavigationRailToggle } from './SidebarNavigationRailToggle';
import {
  type SidebarNavigationExpansionState,
  SidebarNavigationScopeProvider,
} from './SidebarNavigationScopeProvider';
import type { SidebarNavigationProps } from './types';

export const SidebarNavigation = ({
  children,
  closeLabel = 'Close navigation',
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

  const desktopToggleRef = useRef<HTMLButtonElement>(null);
  const closedOnDesktop = useRef(false);
  const [drawerPresent, setDrawerPresent] = useState(false);
  const [desktopExpansion] = useState<SidebarNavigationExpansionState>(
    () => new Map()
  );
  const [drawerExpansion] = useState<SidebarNavigationExpansionState>(
    () => new Map()
  );

  const railHidden = collapsible && isBelowBreakpoint;
  // Keep the drawer content in place until its exit transition finishes.
  const useDrawer = railHidden || drawerOpen === true || drawerPresent;

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    setDrawerPresent(true);
    closedOnDesktop.current = !isBelowBreakpoint;

    if (!isBelowBreakpoint) {
      setDrawerOpen(false);
    }
  }, [drawerOpen, isBelowBreakpoint, setDrawerOpen]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), [setDrawerOpen]);

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
        hidden={railHidden}
        id={id}
        ref={ref}
      >
        <div className={panelClassName} data-slot="sidebar-navigation-rail">
          <div className={shellInnerClassName}>
            {useDrawer ? null : (
              <SidebarNavigationScopeProvider
                expansionState={desktopExpansion}
                renderCollapsed={collapsed}
              >
                {children}
              </SidebarNavigationScopeProvider>
            )}
          </div>
          <SidebarNavigationRailToggle
            collapseLabel={collapseLabel}
            controls={id}
            expandLabel={expandLabel}
            ref={desktopToggleRef}
          />
        </div>
      </aside>
      {collapsible ? (
        <Drawer.Root
          onOpenChange={setDrawerOpen}
          onOpenChangeComplete={setDrawerPresent}
          open={drawerOpen === true}
          swipeDirection="left"
        >
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
              >
                <div className="sidebar-navigation-drawer-close">
                  <Drawer.Close aria-label={closeLabel} render={<IconButton />}>
                    <X aria-hidden="true" />
                  </Drawer.Close>
                </div>
                <div className={shellInnerClassName}>
                  {useDrawer ? (
                    <SidebarNavigationScopeProvider
                      expansionState={drawerExpansion}
                      onItemSelect={closeDrawer}
                      renderCollapsed={false}
                    >
                      {children}
                    </SidebarNavigationScopeProvider>
                  ) : null}
                </div>
              </Drawer.Popup>
            </Drawer.Viewport>
          </Drawer.Portal>
        </Drawer.Root>
      ) : null}
    </Tooltip.Provider>
  );
};
