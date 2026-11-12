import type {
  HTMLAttributeAnchorTarget,
  MouseEvent,
  ReactNode,
  Ref,
} from 'react';
import type { ViewportBreakpoint } from '@/ui/hooks/useBelowViewportBreakpoint';

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
  /** Accessible name of the edge button while the sidebar is expanded. */
  collapseLabel?: string;
  /** Accessible name of the edge button while the sidebar is collapsed. */
  expandLabel?: string;
  id?: string;
  /** Accessible name of the sidebar and of its mobile overlay. */
  label?: string;
  ref?: Ref<HTMLDivElement>;
};

export type SidebarNavigationTriggerProps = {
  /** Accessible name of the button that opens the mobile drawer. */
  label?: string;
};

export type SidebarNavigationBrandProps = {
  logo: ReactNode;
  title: string;
};

export type SidebarNavigationContextValue = {
  breakpoint?: ViewportBreakpoint;
  collapsed: boolean;
  /** True when a provider manages the collapsed state and a toggle is shown. */
  collapsible: boolean;
  /** Undefined until the drawer has first been opened. */
  drawerOpen?: boolean;
  /** Id of the mobile drawer, for the trigger's `aria-controls`. */
  overlayId?: string;
  setCollapsed: (collapsed: boolean) => void;
  setDrawerOpen: (open: boolean) => void;
  toggleCollapsed: () => void;
};

export type SidebarNavigationProviderProps = {
  /** Below this viewport breakpoint, navigation opens in a drawer. */
  breakpoint?: ViewportBreakpoint;
  children: ReactNode;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};

export type SidebarNavigationToggleProps = {
  collapseLabel: string;
  controls?: string;
  expandLabel: string;
  ref?: Ref<HTMLButtonElement>;
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
  ref?: Ref<HTMLElement>;
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
