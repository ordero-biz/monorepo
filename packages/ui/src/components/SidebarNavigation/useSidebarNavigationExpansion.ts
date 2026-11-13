import { useCallback, useEffect, useState } from 'react';
import { useSidebarNavigationScope } from './SidebarNavigationScopeProvider';

type UseSidebarNavigationExpansionArgs = {
  defaultKey: string;
  defaultOpenIds: string[];
  groupKey: string;
};

export const useSidebarNavigationExpansion = ({
  defaultKey,
  defaultOpenIds,
  groupKey,
}: UseSidebarNavigationExpansionArgs) => {
  const { expansionState } = useSidebarNavigationScope();
  const [selection, setSelection] = useState(() => {
    const saved = expansionState?.get(groupKey);
    return saved?.defaultKey === defaultKey ? saved : undefined;
  });

  // Discard manual choices when active items or expansion defaults change.
  useEffect(() => {
    const saved = expansionState?.get(groupKey);
    if (saved && saved.defaultKey !== defaultKey) {
      expansionState?.delete(groupKey);
    }

    if (selection && selection.defaultKey !== defaultKey) {
      setSelection(undefined);
    }
  }, [defaultKey, expansionState, groupKey, selection]);

  const setOpenIds = useCallback(
    (openIds: string[]) => {
      const nextSelection = { defaultKey, openIds };
      expansionState?.set(groupKey, nextSelection);
      setSelection(nextSelection);
    },
    [defaultKey, expansionState, groupKey]
  );

  const openIds =
    selection?.defaultKey === defaultKey ? selection.openIds : defaultOpenIds;

  return [openIds, setOpenIds] as const;
};
