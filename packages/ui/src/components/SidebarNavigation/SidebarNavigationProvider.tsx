'use client';

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from 'react';
import { cn } from '@/ui/lib/utils';
import { providerClassName, sidebarBreakpointClasses } from './classNames';
import {
  DEFAULT_SIDEBAR_BREAKPOINT,
  SIDEBAR_NAVIGATION_COLLAPSED_COOKIE_NAME,
  SIDEBAR_NAVIGATION_COOKIE_MAX_AGE,
} from './constants';
import type {
  SidebarNavigationContextValue,
  SidebarNavigationProviderProps,
} from './types';

const standaloneContextValue: SidebarNavigationContextValue = {
  collapsed: false,
  collapsible: false,
  setDrawerOpen: () => undefined,
  overlayId: undefined,
  setCollapsed: () => undefined,
  toggleCollapsed: () => undefined,
};

const SidebarNavigationContext = createContext<SidebarNavigationContextValue>(
  standaloneContextValue
);

export const useSidebarNavigation = () => useContext(SidebarNavigationContext);

const persistDesktopCollapsed = (isDesktopCollapsed: boolean) => {
  // biome-ignore lint/suspicious/noDocumentCookie: mirrors shadcn sidebar persistence so the server can read the state on first render
  document.cookie = `${SIDEBAR_NAVIGATION_COLLAPSED_COOKIE_NAME}=${isDesktopCollapsed}; path=/; max-age=${SIDEBAR_NAVIGATION_COOKIE_MAX_AGE}; samesite=lax`;
};

export const SidebarNavigationProvider = ({
  breakpoint = DEFAULT_SIDEBAR_BREAKPOINT,
  children,
  collapsed: controlledDesktopCollapsed,
  defaultCollapsed: defaultDesktopCollapsed = false,
  onCollapsedChange: onDesktopCollapsedChange,
}: SidebarNavigationProviderProps) => {
  const [internalDesktopCollapsed, setInternalDesktopCollapsed] = useState(
    defaultDesktopCollapsed
  );
  const [drawerOpen, setDrawerOpen] = useState<boolean>();

  const mobileDrawerId = useId();

  const isDesktopCollapsed =
    controlledDesktopCollapsed ?? internalDesktopCollapsed;

  const updateDesktopCollapsed = useCallback(
    (nextCollapsed: boolean) => {
      if (controlledDesktopCollapsed === undefined) {
        setInternalDesktopCollapsed(nextCollapsed);
        persistDesktopCollapsed(nextCollapsed);
      }

      onDesktopCollapsedChange?.(nextCollapsed);
    },
    [controlledDesktopCollapsed, onDesktopCollapsedChange]
  );

  const toggleDesktopCollapsed = useCallback(
    () => updateDesktopCollapsed(!isDesktopCollapsed),
    [isDesktopCollapsed, updateDesktopCollapsed]
  );

  const navigationContext = useMemo<SidebarNavigationContextValue>(
    () => ({
      breakpoint,
      collapsed: isDesktopCollapsed,
      collapsible: true,
      drawerOpen,
      overlayId: mobileDrawerId,
      setDrawerOpen,
      setCollapsed: updateDesktopCollapsed,
      toggleCollapsed: toggleDesktopCollapsed,
    }),
    [
      breakpoint,
      isDesktopCollapsed,
      drawerOpen,
      mobileDrawerId,
      updateDesktopCollapsed,
      toggleDesktopCollapsed,
    ]
  );

  return (
    <SidebarNavigationContext.Provider value={navigationContext}>
      <div
        className={cn(
          providerClassName,
          sidebarBreakpointClasses[breakpoint].layout
        )}
        data-collapsed={isDesktopCollapsed ? 'true' : 'false'}
        data-slot="sidebar-navigation-provider"
      >
        {children}
      </div>
    </SidebarNavigationContext.Provider>
  );
};
