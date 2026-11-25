import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { useSidebarNavigation } from './SidebarNavigationProvider';

export type SidebarNavigationExpansionState = Map<
  string,
  { defaultKey: string; openIds: string[] }
>;

type SidebarNavigationScopeValue = {
  expansionState?: SidebarNavigationExpansionState;
  onItemSelect?: () => void;
  renderCollapsed: boolean;
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
  expansionState,
  onItemSelect,
  renderCollapsed,
}: SidebarNavigationScopeProviderProps) => {
  const parentScope = useContext(SidebarNavigationScopeContext);

  const scopedContext = useMemo(
    () => ({
      renderCollapsed,
      expansionState: expansionState ?? parentScope?.expansionState,
      onItemSelect: onItemSelect ?? parentScope?.onItemSelect,
    }),
    [expansionState, onItemSelect, parentScope, renderCollapsed]
  );

  return (
    <SidebarNavigationScopeContext.Provider value={scopedContext}>
      {children}
    </SidebarNavigationScopeContext.Provider>
  );
};
