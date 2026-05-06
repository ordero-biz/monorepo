import type { CSSProperties } from 'react';

export type SidebarNavigationStyle = CSSProperties & {
  '--_sidebar-navigation-item-height'?: string;
  '--_sidebar-navigation-sub-item-height'?: string;
  '--_sidebar-navigation-width'?: string;
};

export const sidebarNavigationStyle: SidebarNavigationStyle = {
  '--_sidebar-navigation-item-height':
    'calc(var(--space-5) + var(--space-0-5))',
  '--_sidebar-navigation-sub-item-height':
    'calc(var(--space-4) + var(--space-0-5))',
  '--_sidebar-navigation-width': 'calc(var(--space-20) + var(--space-15))',
};

export const shellClassName =
  'flex h-full w-[var(--_sidebar-navigation-width)] min-w-[var(--_sidebar-navigation-width)] flex-col overflow-hidden border-r border-border bg-background';

export const headerClassName =
  'shrink-0 px-[var(--space-1-5)] pb-[var(--space-1)] pt-[var(--space-3)]';

export const contentClassName =
  'min-h-0 flex-1 overflow-y-auto px-[var(--space-2)] pb-[var(--space-3)]';

export const footerClassName =
  'shrink-0 px-[var(--space-2)] pb-[var(--space-5)] pt-[var(--space-3)]';

export const navClassName = 'flex flex-col gap-[var(--space-0-5)]';

export const sectionRootClassName = 'flex flex-col gap-[var(--space-0-5)]';

export const sectionLabelClassName =
  'flex w-full items-center gap-[var(--space-1)] px-[var(--space-1-5)] pb-[var(--space-1)] pt-[var(--space-2)] text-left text-[length:var(--nav-subheader-size-desktop)] leading-[var(--nav-subheader-line-height-desktop)] font-[var(--nav-subheader-weight)] uppercase text-[var(--text-disabled)] outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50';

export const sectionContentClassName = 'flex flex-col gap-[var(--space-0-5)]';

export const itemLabelClassName =
  'min-w-0 flex-1 truncate text-[length:var(--nav-item-size-desktop)] leading-[var(--nav-item-line-height-desktop)]';

export const iconSlotClassName =
  'mr-[var(--space-1-5)] flex size-[var(--space-3)] shrink-0 items-center justify-center [&_svg]:size-full';

export const nestedListContainerClassName =
  'relative ml-[10px] pl-[var(--space-1-5)]';

export const nestedListLineClassName =
  'absolute bottom-[var(--space-2)] left-0 top-0 w-px bg-[var(--color-grey-12)]';

export const nestedItemWrapperClassName = 'relative pl-[var(--space-1)]';

export const nestedItemCurveClassName =
  'absolute left-[-12px] top-0 h-[18px] w-[12px] rounded-bl-[var(--radius-1-token)] border-b border-l border-[var(--color-grey-12)]';
