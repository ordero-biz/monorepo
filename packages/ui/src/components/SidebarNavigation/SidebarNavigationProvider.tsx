'use client';

import {
  type CSSProperties,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { providerClassName } from './classNames';
import {
  SIDEBAR_NAVIGATION_COLLAPSED_COOKIE,
  SIDEBAR_NAVIGATION_COOKIE_MAX_AGE,
} from './constants';
import type {
  SidebarNavigationContextValue,
  SidebarNavigationProviderProps,
} from './types';

const defaultContextValue: SidebarNavigationContextValue = {
  collapsed: false,
  collapsible: false,
  setCollapsed: () => undefined,
  toggleCollapsed: () => undefined,
};

const SidebarNavigationContext =
  createContext<SidebarNavigationContextValue>(defaultContextValue);

export const useSidebarNavigation = () => useContext(SidebarNavigationContext);

/**
 * Overrides the collapsed state for a subtree, e.g. to render the expanded
 * menu inside a popover while the rail itself is collapsed.
 */
export const SidebarNavigationExpandedScope = ({
  children,
}: {
  children: ReactNode;
}) => {
  const parent = useSidebarNavigation();
  const value = useMemo(
    () => ({ ...parent, collapsed: false, collapsible: false }),
    [parent]
  );

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

export const SidebarNavigationProvider = ({
  children,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
}: SidebarNavigationProviderProps) => {
  const [uncontrolledCollapsed, setUncontrolledCollapsed] =
    useState(defaultCollapsed);
  const collapsed = collapsedProp ?? uncontrolledCollapsed;

  const setCollapsed = useCallback(
    (nextCollapsed: boolean) => {
      if (collapsedProp === undefined) {
        setUncontrolledCollapsed(nextCollapsed);
      }

      persistCollapsed(nextCollapsed);
      onCollapsedChange?.(nextCollapsed);
    },
    [collapsedProp, onCollapsedChange]
  );

  const toggleCollapsed = useCallback(
    () => setCollapsed(!collapsed),
    [collapsed, setCollapsed]
  );

  const value = useMemo<SidebarNavigationContextValue>(
    () => ({ collapsed, collapsible: true, setCollapsed, toggleCollapsed }),
    [collapsed, setCollapsed, toggleCollapsed]
  );

  return (
    <SidebarNavigationContext.Provider value={value}>
      <div
        className={providerClassName}
        data-collapsed={collapsed ? 'true' : 'false'}
        data-slot="sidebar-navigation-provider"
        style={
          {
            '--sidebar-navigation-width': collapsed
              ? 'var(--nav-mini-width)'
              : 'var(--nav-width)',
          } as CSSProperties
        }
      >
        {children}
      </div>
    </SidebarNavigationContext.Provider>
  );
};
