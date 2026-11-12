import { dropdownSurfaceClassName } from '@/ui/components/Select';
import type { ViewportBreakpoint } from '@/ui/hooks/useBelowViewportBreakpoint';
import { cn } from '@/ui/lib/utils';

export const sidebarBreakpointClasses = {
  sm: {
    rail: 'max-sm:hidden',
    trigger: 'sm:hidden',
    layout: 'max-sm:[--sidebar-navigation-width:0px]',
  },
  md: {
    rail: 'max-md:hidden',
    trigger: 'md:hidden',
    layout: 'max-md:[--sidebar-navigation-width:0px]',
  },
  lg: {
    rail: 'max-lg:hidden',
    trigger: 'lg:hidden',
    layout: 'max-lg:[--sidebar-navigation-width:0px]',
  },
  xl: {
    rail: 'max-xl:hidden',
    trigger: 'xl:hidden',
    layout: 'max-xl:[--sidebar-navigation-width:0px]',
  },
} satisfies Record<
  ViewportBreakpoint,
  { rail: string; trigger: string; layout: string }
>;

export const providerClassName =
  'sidebar-navigation-provider flex min-h-screen w-full';

// The aside reserves layout space; the panel inside it holds the visible
// sidebar and can grow past the aside to overlay content on mobile.
export const shellClassName =
  'group/sidebar-navigation sticky top-0 z-[1] h-screen w-[var(--sidebar-navigation-width,var(--nav-width))] min-w-[var(--sidebar-navigation-width,var(--nav-width))] shrink-0 transition-[width,min-width] duration-[var(--sidebar-navigation-duration)] ease-[var(--sidebar-navigation-easing)] motion-reduce:transition-none';

export const panelClassName =
  'relative h-full w-[var(--sidebar-navigation-panel-width,var(--nav-width))] border-r border-border bg-background transition-[width] duration-[var(--sidebar-navigation-duration)] ease-[var(--sidebar-navigation-easing)] motion-reduce:transition-none';

const overlayTransitionClassName =
  'duration-[var(--sidebar-navigation-overlay-duration)] ease-[var(--sidebar-navigation-easing)] motion-reduce:transition-none';

export const overlayBackdropClassName = `fixed inset-0 z-50 min-h-dvh bg-[var(--backdrop)] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute ${overlayTransitionClassName}`;

export const overlayViewportClassName = 'fixed inset-0 z-50';

// Slides in from the left and follows the finger while it is swiped away.
export const overlayPopupClassName = `group/sidebar-navigation absolute inset-y-0 left-0 h-dvh w-[var(--nav-width)] border-r border-border bg-background outline-none [transform:translateX(var(--drawer-swipe-movement-x,0px))] transition-transform data-[ending-style]:[transform:translateX(-100%)] data-[starting-style]:[transform:translateX(-100%)] data-[swiping]:transition-none ${overlayTransitionClassName}`;

export const shellInnerClassName =
  'flex h-full min-h-0 w-full flex-col overflow-hidden';

export const toggleClassName =
  'absolute top-[calc(var(--space-9)/2)] right-0 z-[1] flex size-[var(--nav-toggle-size)] translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[color:var(--color-grey-12)] bg-background p-[var(--space-0-5)] text-[var(--action-active)] outline-none transition-[background-color,color] hover:bg-[var(--background-neutral)] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 before:absolute before:top-1/2 before:left-1/2 before:size-[var(--nav-item-root-height)] before:-translate-x-1/2 before:-translate-y-1/2 before:content-[';
(']');

export const collapsedHiddenClassName =
  'transition-opacity duration-[var(--sidebar-navigation-duration)] group-data-[collapsed=true]/sidebar-navigation:pointer-events-none group-data-[collapsed=true]/sidebar-navigation:opacity-0';

export const collapsedRemovedClassName =
  'group-data-[collapsed=true]/sidebar-navigation:hidden';

export const tooltipPopupClassName =
  'z-50 rounded-[var(--radius-1-token)] bg-[var(--grey-800)] px-[var(--tooltip-px)] py-[var(--tooltip-py)] text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] font-[var(--caption-weight)] text-[var(--tooltip-color)] outline-none transition-opacity duration-100 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0';

// Matches the Menu popup surface so nested navigation looks like other menus.
export const popoverPopupClassName = cn(
  'z-50 flex min-w-[var(--space-20)] flex-col gap-[var(--menu-list-spacing)] rounded-[var(--radius)] border border-border bg-popover p-[var(--menu-list-p)] text-popover-foreground shadow-[var(--dropdown-x1)_var(--dropdown-y1)_var(--dropdown-blur1)_var(--dropdown-spread1)_var(--color-grey-16),var(--dropdown-x2)_var(--dropdown-y2)_var(--dropdown-blur2)_var(--dropdown-spread2)_var(--color-grey-20)] outline-none transition-opacity duration-100 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
  dropdownSurfaceClassName
);

export const popoverTitleClassName =
  'px-[var(--space-1-5)] pb-[var(--space-0-5)] pt-[var(--space-1)] text-[length:var(--nav-subheader-size-desktop)] leading-[var(--nav-subheader-line-height-desktop)] font-[var(--nav-subheader-weight)] uppercase text-[var(--text-secondary)]';

export const triggerClassName = 'inline-flex';

export const brandClassName =
  'flex items-center gap-[var(--space-1)] px-[var(--space-1-5)]';

export const brandLogoClassName =
  'flex size-[var(--space-4)] shrink-0 items-center justify-center rounded-[var(--radius-50-token)] bg-primary text-primary-foreground [&_svg]:size-4';

export const brandTitleClassName =
  'whitespace-nowrap text-[length:var(--subtitle1-size-desktop)] leading-[var(--subtitle1-line-height-desktop)] font-[var(--subtitle1-weight)] text-[var(--text-primary)]';

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
