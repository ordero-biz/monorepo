'use client';

import './styles.css';
import { Drawer } from '@base-ui/react/drawer';
import { Tooltip } from '@base-ui/react/tooltip';
import type { MouseEvent } from 'react';
import {
  overlayBackdropClassName,
  overlayPopupClassName,
  overlayViewportClassName,
  panelClassName,
  shellClassName,
  shellInnerClassName,
} from './classNames';
import {
  SidebarNavigationScope,
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
  const { collapsed, collapsible, isMobile, overlayId, setCollapsed } =
    useSidebarNavigation();
  // On mobile the sidebar itself is hidden (and its items are not rendered)
  // and opens in a modal drawer from SidebarNavigationTrigger in the header.
  const railCollapsed = isMobile || collapsed;
  const overlayOpen = collapsible && isMobile && !collapsed;

  // Close the drawer once an item is selected. React events bubble through
  // portals, so this also covers links inside nested popovers.
  const handleOverlayClick = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as Element).closest(selectableItemSelector)) {
      setCollapsed(true);
    }
  };

  return (
    <Tooltip.Provider delay={0}>
      <aside
        aria-label={label}
        className={shellClassName}
        data-collapsed={railCollapsed ? 'true' : 'false'}
        data-slot="sidebar-navigation"
        id={id}
        ref={ref}
      >
        {isMobile ? null : (
          <div className={panelClassName} data-slot="sidebar-navigation-rail">
            <div className={shellInnerClassName}>
              <SidebarNavigationScope collapsed={railCollapsed}>
                {children}
              </SidebarNavigationScope>
            </div>
            <SidebarNavigationToggle
              collapseLabel={collapseLabel}
              controls={id}
              expandLabel={expandLabel}
            />
          </div>
        )}
      </aside>
      {collapsible && isMobile ? (
        <Drawer.Root
          onOpenChange={(open) => setCollapsed(!open)}
          open={overlayOpen}
          swipeDirection="left"
        >
          {/* Kept mounted so branches the user expanded stay open between visits. */}
          <Drawer.Portal keepMounted>
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
                id={overlayId}
                onClick={handleOverlayClick}
              >
                <div className={shellInnerClassName}>
                  <SidebarNavigationScope collapsed={false}>
                    {children}
                  </SidebarNavigationScope>
                </div>
              </Drawer.Popup>
            </Drawer.Viewport>
          </Drawer.Portal>
        </Drawer.Root>
      ) : null}
    </Tooltip.Provider>
  );
};
