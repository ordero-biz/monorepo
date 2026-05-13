import type {
  SidebarNavigationCollapseItem,
  SidebarNavigationItem,
  SidebarNavigationSectionConfig,
} from './types';

export const getVisibleItems = (
  items: SidebarNavigationItem[]
): SidebarNavigationItem[] =>
  items.reduce<SidebarNavigationItem[]>((visibleItems, item) => {
    if (item.hidden) {
      return visibleItems;
    }

    if (item.kind !== 'collapse') {
      visibleItems.push(item);
      return visibleItems;
    }

    const visibleChildren = getVisibleItems(item.items);

    if (visibleChildren.length === 0) {
      return visibleItems;
    }

    visibleItems.push({
      ...item,
      items: visibleChildren,
    });

    return visibleItems;
  }, []);

export const getVisibleSections = (
  sections: SidebarNavigationSectionConfig[]
): SidebarNavigationSectionConfig[] =>
  sections.reduce<SidebarNavigationSectionConfig[]>(
    (visibleSections, section) => {
      if (section.hidden) {
        return visibleSections;
      }

      const visibleItems = getVisibleItems(section.items);

      if (visibleItems.length === 0) {
        return visibleSections;
      }

      visibleSections.push({
        ...section,
        items: visibleItems,
      });

      return visibleSections;
    },
    []
  );

export const isItemBranchActive = (item: SidebarNavigationItem): boolean => {
  if (item.active) {
    return true;
  }

  if (item.kind !== 'collapse') {
    return false;
  }

  return item.items.some(isItemBranchActive);
};

const shouldItemBeExpanded = (item: SidebarNavigationCollapseItem) =>
  item.defaultExpanded || item.items.some(isItemBranchActive);

export const getExpandedItemIds = (items: SidebarNavigationItem[]) =>
  items.flatMap((item) =>
    item.kind === 'collapse' && shouldItemBeExpanded(item) ? [item.id] : []
  );

export const shouldSectionBeExpanded = (
  section: SidebarNavigationSectionConfig
) => section.defaultExpanded || section.items.some(isItemBranchActive);

export const toAccordionItemIds = (value: (string | null)[]) =>
  value.flatMap((itemId) => (typeof itemId === 'string' ? [itemId] : []));
