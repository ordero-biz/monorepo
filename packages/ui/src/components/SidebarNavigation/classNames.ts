export const providerClassName = 'flex min-h-screen w-full';

export const shellClassName =
  'group/sidebar-navigation sticky top-0 z-[1] flex h-screen w-[var(--sidebar-navigation-width,var(--nav-width))] min-w-[var(--sidebar-navigation-width,var(--nav-width))] shrink-0 flex-col border-r border-border bg-background transition-[width,min-width] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none';

export const shellInnerClassName =
  'flex h-full min-h-0 w-full flex-col overflow-hidden';

export const toggleClassName =
  'absolute top-[calc(var(--space-9)/2)] right-0 z-[1] flex size-[var(--nav-toggle-size)] translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[color:var(--color-grey-12)] bg-background p-[var(--space-0-5)] text-[var(--action-active)] outline-none transition-[background-color,color] hover:bg-[var(--background-neutral)] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50';

export const collapsedHiddenClassName =
  'transition-opacity duration-200 group-data-[collapsed=true]/sidebar-navigation:pointer-events-none group-data-[collapsed=true]/sidebar-navigation:opacity-0';

export const collapsedRemovedClassName =
  'group-data-[collapsed=true]/sidebar-navigation:hidden';

export const tooltipPopupClassName =
  'z-50 rounded-[var(--radius-1-token)] bg-[var(--grey-800)] px-[var(--tooltip-px)] py-[var(--tooltip-py)] text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] font-[var(--caption-weight)] text-[var(--tooltip-color)] outline-none transition-opacity duration-100 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0';

export const popoverPopupClassName =
  'z-50 flex min-w-[200px] flex-col gap-[var(--space-0-5)] rounded-[var(--radius)] border border-border bg-popover p-[var(--space-0-5)] text-popover-foreground shadow-[var(--dropdown-x1)_var(--dropdown-y1)_var(--dropdown-blur1)_var(--dropdown-spread1)_var(--color-grey-16),var(--dropdown-x2)_var(--dropdown-y2)_var(--dropdown-blur2)_var(--dropdown-spread2)_var(--color-grey-20)] outline-none transition-opacity duration-100 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0';

export const popoverTitleClassName =
  'px-[var(--space-1-5)] pb-[var(--space-0-5)] pt-[var(--space-1)] text-[length:var(--nav-subheader-size-desktop)] leading-[var(--nav-subheader-line-height-desktop)] font-[var(--nav-subheader-weight)] uppercase text-[var(--text-secondary)]';

export const headerClassName =
  'shrink-0 overflow-hidden whitespace-nowrap px-[var(--space-1-5)] pb-[var(--space-1)] pt-[var(--space-3)]';

export const contentClassName =
  'min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-[var(--space-2)] pb-[var(--space-3)]';

export const footerClassName =
  'shrink-0 overflow-hidden px-[var(--space-2)] pb-[var(--space-5)] pt-[var(--space-3)]';

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
