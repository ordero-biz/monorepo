'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { providerClassName } from './classNames';
import {
  SIDEBAR_NAVIGATION_COLLAPSED_COOKIE,
  SIDEBAR_NAVIGATION_COOKIE_MAX_AGE,
  SIDEBAR_NAVIGATION_MOBILE_BREAKPOINT_FALLBACK,
  SIDEBAR_NAVIGATION_MOBILE_BREAKPOINT_TOKEN,
} from './constants';
import type {
  SidebarNavigationContextValue,
  SidebarNavigationProviderProps,
} from './types';

const defaultContextValue: SidebarNavigationContextValue = {
  collapsed: false,
  collapsible: false,
  isMobile: false,
  overlayId: undefined,
  setCollapsed: () => undefined,
  toggleCollapsed: () => undefined,
};

const SidebarNavigationContext =
  createContext<SidebarNavigationContextValue>(defaultContextValue);

export const useSidebarNavigation = () => useContext(SidebarNavigationContext);

/**
 * Overrides how a subtree renders the items, e.g. the expanded menu inside a
 * branch popover or the mobile drawer.
 */
export const SidebarNavigationScope = ({
  children,
  collapsed,
}: {
  children: ReactNode;
  collapsed: boolean;
}) => {
  const parent = useSidebarNavigation();
  const value = useMemo(() => ({ ...parent, collapsed }), [parent, collapsed]);

  return (
    <SidebarNavigationContext.Provider value={value}>
      {children}
    </SidebarNavigationContext.Provider>
  );
};

const persistCollapsed = (collapsed: boolean) => {
  // biome-ignore lint/suspicious/noDocumentCookie: mirrors shadcn sidebar persistence so the server can read the state on first render
  document.cookie = `${SIDEBAR_NAVIGATION_COLLAPSED_COOKIE}=${collapsed}; path=/; max-age=${SIDEBAR_NAVIGATION_COOKIE_MAX_AGE}; samesite=lax`;
};

let mobileBreakpoint: string | undefined;

const getMobileMediaQuery = () => {
  mobileBreakpoint ??=
    getComputedStyle(document.documentElement)
      .getPropertyValue(SIDEBAR_NAVIGATION_MOBILE_BREAKPOINT_TOKEN)
      .trim() || SIDEBAR_NAVIGATION_MOBILE_BREAKPOINT_FALLBACK;

  return window.matchMedia?.(`(width < ${mobileBreakpoint})`);
};

const subscribeToMobile = (onChange: () => void) => {
  const mediaQuery = getMobileMediaQuery();

  mediaQuery?.addEventListener?.('change', onChange);

  return () => mediaQuery?.removeEventListener?.('change', onChange);
};

const getIsMobile = () => Boolean(getMobileMediaQuery()?.matches);

// The server cannot know the viewport, so it renders the desktop layout.
const getIsMobileOnServer = () => false;

export const SidebarNavigationProvider = ({
  children,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
}: SidebarNavigationProviderProps) => {
  const isMobile = useSyncExternalStore(
    subscribeToMobile,
    getIsMobile,
    getIsMobileOnServer
  );
  const [uncontrolledCollapsed, setUncontrolledCollapsed] =
    useState(defaultCollapsed);
  // On mobile the sidebar is an overlay that starts closed and is not persisted.
  const [mobileOpen, setMobileOpen] = useState(false);
  const overlayId = useId();
  const desktopCollapsed = collapsedProp ?? uncontrolledCollapsed;
  const collapsed = isMobile ? !mobileOpen : desktopCollapsed;

  const setCollapsed = useCallback(
    (nextCollapsed: boolean) => {
      if (isMobile) {
        setMobileOpen(!nextCollapsed);
        return;
      }

      // A controlled consumer owns the state and decides where to keep it.
      if (collapsedProp === undefined) {
        setUncontrolledCollapsed(nextCollapsed);
        persistCollapsed(nextCollapsed);
      }

      onCollapsedChange?.(nextCollapsed);
    },
    [collapsedProp, isMobile, onCollapsedChange]
  );

  const toggleCollapsed = useCallback(
    () => setCollapsed(!collapsed),
    [collapsed, setCollapsed]
  );

  const value = useMemo<SidebarNavigationContextValue>(
    () => ({
      collapsed,
      collapsible: true,
      isMobile,
      overlayId,
      setCollapsed,
      toggleCollapsed,
    }),
    [collapsed, isMobile, overlayId, setCollapsed, toggleCollapsed]
  );

  return (
    <SidebarNavigationContext.Provider value={value}>
      <div
        className={providerClassName}
        data-collapsed={desktopCollapsed ? 'true' : 'false'}
        data-slot="sidebar-navigation-provider"
      >
        {children}
      </div>
    </SidebarNavigationContext.Provider>
  );
};
