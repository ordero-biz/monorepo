import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { useSidebarNavigation } from './SidebarNavigationProvider';

type SidebarNavigationScopeValue = {
  onItemSelect?: () => void;
  renderCollapsed: boolean;
  sectionIdPrefix?: string;
};

type SidebarNavigationScopeProviderProps = SidebarNavigationScopeValue & {
  children: ReactNode;
};

const SidebarNavigationScopeContext =
  createContext<SidebarNavigationScopeValue | null>(null);

export const useSidebarNavigationScope = (): SidebarNavigationScopeValue => {
  const scope = useContext(SidebarNavigationScopeContext);
  const { collapsed } = useSidebarNavigation();

  return scope ?? { renderCollapsed: collapsed };
};

/** Supplies rendering and selection settings for a drawer or popover subtree. */
export const SidebarNavigationScopeProvider = ({
  children,
  onItemSelect,
  renderCollapsed,
  sectionIdPrefix,
}: SidebarNavigationScopeProviderProps) => {
  const parentScope = useContext(SidebarNavigationScopeContext);

  const scopedContext = useMemo(
    () => ({
      renderCollapsed,
      onItemSelect: onItemSelect ?? parentScope?.onItemSelect,
      sectionIdPrefix: sectionIdPrefix ?? parentScope?.sectionIdPrefix,
    }),
    [onItemSelect, parentScope, renderCollapsed, sectionIdPrefix]
  );

  return (
    <SidebarNavigationScopeContext.Provider value={scopedContext}>
      {children}
    </SidebarNavigationScopeContext.Provider>
  );
};
