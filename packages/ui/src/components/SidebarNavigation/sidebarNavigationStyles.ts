export const shellClassName =
  'flex h-full w-[var(--nav-width)] min-w-[var(--nav-width)] flex-col overflow-hidden border-r border-border bg-background';

export const headerClassName =
  'shrink-0 px-[var(--space-1-5)] pb-[var(--space-1)] pt-[var(--space-3)]';

export const contentClassName =
  'min-h-0 flex-1 overflow-y-auto px-[var(--space-2)] pb-[var(--space-3)]';

export const footerClassName =
  'shrink-0 px-[var(--space-2)] pb-[var(--space-5)] pt-[var(--space-3)]';

export const navClassName = 'flex flex-col gap-[var(--space-0-5)]';

export const sectionRootClassName = 'flex flex-col gap-[var(--space-0-5)]';

export const sectionLabelClassName =
  'flex w-full items-center gap-[var(--space-1)] px-[var(--space-1-5)] pb-[var(--space-1)] pt-[var(--space-2)] text-left text-[length:var(--nav-subheader-size-desktop)] leading-[var(--nav-subheader-line-height-desktop)] font-[var(--nav-subheader-weight)] uppercase text-[var(--text-secondary)] outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50';

export const sectionContentClassName = 'flex flex-col gap-[var(--space-0-5)]';

export const accordionPanelClassName = 'sidebar-navigation-panel';

export const accordionPanelContentClassName =
  'sidebar-navigation-panel-content';

export const itemLabelClassName =
  'min-w-0 flex-1 truncate text-[length:var(--nav-item-size-desktop)] leading-[var(--nav-item-line-height-desktop)]';

export const iconSlotClassName =
  'mr-[var(--space-1-5)] flex size-[var(--space-3)] shrink-0 items-center justify-center [&_svg]:size-full';

export const nestedListContainerClassName =
  'sidebar-navigation-subtree relative pl-[var(--nav-bullet-gutter)]';

export const nestedItemWrapperClassName = 'relative';

export const nestedItemClassName = 'sidebar-navigation-subitem relative';
