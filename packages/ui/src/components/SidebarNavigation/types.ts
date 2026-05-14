import type { HTMLAttributeAnchorTarget, MouseEvent, ReactNode } from 'react';

type SidebarNavigationBaseItem = {
  active?: boolean;
  badge?: ReactNode;
  disabled?: boolean;
  hidden?: boolean;
  icon?: ReactNode;
  id: string;
  label: string;
};

export type SidebarNavigationRenderLinkArgs = {
  ariaCurrent?: 'page';
  children: ReactNode;
  className: string;
  external: boolean;
  href: string;
  item: SidebarNavigationLinkItem;
  rel?: string;
  target?: HTMLAttributeAnchorTarget;
};

export type SidebarNavigationRenderLink = (
  args: SidebarNavigationRenderLinkArgs
) => ReactNode;

export type SidebarNavigationActionSelectArgs = {
  event: MouseEvent<HTMLButtonElement>;
  item: SidebarNavigationActionItem;
};

export type SidebarNavigationActionItem = SidebarNavigationBaseItem & {
  kind: 'action';
  onSelect: (args: SidebarNavigationActionSelectArgs) => void;
};

export type SidebarNavigationLinkItem = SidebarNavigationBaseItem & {
  external?: boolean;
  href: string;
  kind: 'link';
  rel?: string;
  renderLink?: SidebarNavigationRenderLink;
  target?: HTMLAttributeAnchorTarget;
};

export type SidebarNavigationCollapseItem = SidebarNavigationBaseItem & {
  defaultExpanded?: boolean;
  items: SidebarNavigationItem[];
  kind: 'collapse';
};

export type SidebarNavigationItem =
  | SidebarNavigationActionItem
  | SidebarNavigationLinkItem
  | SidebarNavigationCollapseItem;

export type SidebarNavigationProps = {
  children: ReactNode;
  id?: string;
};

export type SidebarNavigationHeaderProps = {
  children: ReactNode;
};

export type SidebarNavigationContentProps = {
  ariaLabel?: string;
  children: ReactNode;
};

export type SidebarNavigationFooterProps = {
  children: ReactNode;
};

export type SidebarNavigationSectionProps = {
  children: ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  hidden?: boolean;
  id: string;
  label?: string;
};

export type SidebarNavigationSectionContentProps = {
  children: ReactNode;
};

export type SidebarNavigationSectionConfig = {
  collapsible?: boolean;
  defaultExpanded?: boolean;
  hidden?: boolean;
  id: string;
  items: SidebarNavigationItem[];
  label?: string;
};

export type SidebarNavigationSectionsProps = {
  renderLink?: SidebarNavigationRenderLink;
  sections: SidebarNavigationSectionConfig[];
};

export type SidebarNavigationMenuProps = {
  ariaLabel?: string;
  items: SidebarNavigationItem[];
  renderLink?: SidebarNavigationRenderLink;
};
