import type {
  SidebarNavigationItem,
  SidebarNavigationSectionConfig,
} from '@ordero/ui';

type GetSidebarSectionsArgs = {
  pathname: string;
  sections: SidebarNavigationSectionConfig[];
};

const normalizePathname = (pathname: string) =>
  pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;

const isMatchingHref = (pathname: string, href: string) => {
  const normalizedHref = normalizePathname(href);

  return (
    pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`)
  );
};

const getLinkItems = (
  items: SidebarNavigationItem[]
): SidebarNavigationItem[] =>
  items.flatMap((item) =>
    item.kind === 'collapse' ? [item, ...getLinkItems(item.items)] : [item]
  );

const setActiveItem = (
  items: SidebarNavigationItem[],
  activeItemId?: string
): SidebarNavigationItem[] =>
  items.map((item) => {
    if (item.kind === 'collapse') {
      return {
        ...item,
        active: item.id === activeItemId,
        items: setActiveItem(item.items, activeItemId),
      };
    }

    return {
      ...item,
      active: item.id === activeItemId,
    };
  });

export const getSidebarSections = ({
  pathname,
  sections,
}: GetSidebarSectionsArgs): SidebarNavigationSectionConfig[] => {
  const normalizedPathname = normalizePathname(pathname);
  const activeItem = sections
    .flatMap((section) => getLinkItems(section.items))
    .filter(
      (item) =>
        item.kind === 'link' && isMatchingHref(normalizedPathname, item.href)
    )
    .sort((left, right) => {
      const leftHrefLength = left.kind === 'link' ? left.href.length : 0;
      const rightHrefLength = right.kind === 'link' ? right.href.length : 0;

      return rightHrefLength - leftHrefLength;
    })[0];

  return sections.map((section) => ({
    ...section,
    items: setActiveItem(section.items, activeItem?.id),
  }));
};
