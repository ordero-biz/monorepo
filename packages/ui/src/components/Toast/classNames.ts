import { cn } from '@/ui/lib/utils';

export const viewportBaseClassName =
  'fixed right-[var(--space-2)] bottom-[var(--space-2)] z-50 w-[min(calc(100vw_-_var(--space-4)),300px)] max-w-full outline-none sm:right-[var(--space-4)] sm:bottom-[var(--space-4)]';

export const viewportStackClassName = viewportBaseClassName;

export const viewportListClassName = cn(viewportBaseClassName, 'flex flex-col');

export const stackRootClassName = cn(
  'pointer-events-auto absolute right-0 bottom-0 left-auto w-full cursor-default select-none overflow-visible rounded-[var(--snackbar-radius)] outline-none shadow-[var(--z8-x)_var(--z8-y)_var(--z8-blur)_var(--z8-spread)_var(--color-shadow-16)] [--toast-gap:var(--space-1-5)] [--toast-peek:var(--toast-gap)] [--toast-scale:calc(max(0,_1_-_(var(--toast-index)_*_0.1)))] [--toast-shrink:calc(1_-_var(--toast-scale))] [--toast-stack-height:var(--toast-frontmost-height,var(--toast-height))] [--toast-offset-y-expanded:calc((var(--toast-offset-y,0px)_*_-1)_+_(var(--toast-index)_*_var(--toast-gap)_*_-1)_+_var(--toast-swipe-movement-y,0px))] [transform-origin:center_bottom] [will-change:transform,opacity,height] focus-visible:ring-3 focus-visible:ring-ring/50',
  'z-[calc(1000-var(--toast-index))]',
  'h-[var(--toast-stack-height)]',
  '[transition:transform_320ms_cubic-bezier(0.22,1,0.36,1),opacity_220ms_ease-out,height_320ms_cubic-bezier(0.22,1,0.36,1)]',
  '[transform:translateX(var(--toast-swipe-movement-x,0px))_translateY(calc(var(--toast-swipe-movement-y,0px)_-_(var(--toast-index)_*_var(--toast-peek))_-_(var(--toast-shrink)_*_var(--toast-stack-height))))_scale(var(--toast-scale))]',
  'data-[limited]:pointer-events-none data-[limited]:opacity-0',
  'data-[expanded]:h-[var(--toast-height)] data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x,0px))_translateY(var(--toast-offset-y-expanded))]',
  'data-[starting-style]:opacity-0 data-[starting-style]:[transform:translateY(calc(100%_+_var(--space-2)))_scale(0.96)]',
  'data-[ending-style]:opacity-0 [&[data-ending-style]:not([data-swipe-direction])]:[transform:translateY(150%)]',
  'data-[swiping]:transition-none',
  'data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x,0px)_+_150%))_translateY(var(--toast-offset-y-expanded))]',
  'data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x,0px)_-_150%))_translateY(var(--toast-offset-y-expanded))]',
  'data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y,0px)_-_150%))]',
  'data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y,0px)_+_150%))]',
  'before:absolute before:right-0 before:bottom-full before:left-0 before:h-[calc(var(--toast-gap)_+_1px)] before:w-full before:content-[""]'
);

export const listRootClassName = cn(
  'pointer-events-auto relative mt-[var(--toast-gap)] h-[var(--toast-height,_0px)] w-full cursor-default select-none overflow-hidden rounded-[var(--snackbar-radius)] outline-none shadow-[var(--z8-x)_var(--z8-y)_var(--z8-blur)_var(--z8-spread)_var(--color-shadow-16)] [--toast-gap:var(--space-1-5)] [will-change:transform,opacity,height,margin-top] first:mt-0 focus-visible:ring-3 focus-visible:ring-ring/50',
  '[transition:transform_420ms_cubic-bezier(0.45,0,0.55,1),opacity_260ms_ease-out,height_300ms_cubic-bezier(0.45,0,0.55,1),margin-top_300ms_cubic-bezier(0.45,0,0.55,1)]',
  'data-[limited]:pointer-events-none data-[limited]:opacity-0 data-[limited]:mt-0 data-[limited]:h-0',
  'data-[promoted]:[transition:transform_420ms_cubic-bezier(0.45,0,0.55,1),height_300ms_cubic-bezier(0.45,0,0.55,1),margin-top_300ms_cubic-bezier(0.45,0,0.55,1)]',
  'data-[starting-style]:[transform:translateX(calc(100%_+_var(--space-2)))] data-[starting-style]:opacity-0 data-[starting-style]:mt-0 data-[starting-style]:h-0',
  'data-[ending-style]:[transform:translateX(calc(100%_+_var(--space-2)))] data-[ending-style]:opacity-0',
  'data-[swiping]:transition-none',
  'data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x,0px)_+_150%))]',
  'data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x,0px)_-_150%))]',
  'data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y,0px)_-_150%))]',
  'data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y,0px)_+_150%))]'
);

export const stackContentClassName =
  'relative flex h-full w-full items-center gap-[var(--snackbar-spacing)] overflow-hidden [transition:opacity_250ms_cubic-bezier(0.22,1,0.36,1)] data-[behind]:opacity-0 data-[expanded]:opacity-100 data-[deduplicated=true]:animate-[toast-deduplicated_240ms_cubic-bezier(0.22,1,0.36,1)]';

export const listContentClassName =
  'relative flex h-full w-full items-center gap-[var(--snackbar-spacing)] overflow-hidden data-[deduplicated=true]:animate-[toast-deduplicated_240ms_cubic-bezier(0.22,1,0.36,1)]';

export const defaultContentClassName =
  'py-[var(--snackbar-spacing)] pr-[var(--space-6)] pl-[var(--snackbar-spacing)] text-[var(--global-inherit-color)]';

export const filledContentClassName =
  'py-[var(--snackbar-py)] pr-[var(--space-6)] pl-[var(--snackbar-pl)] text-[var(--text-primary)]';

export const defaultRootSurfaceClassName =
  'bg-[var(--global-inherit-background)]';

export const filledRootSurfaceClassName = 'bg-[var(--background-paper)]';

export const iconContainerClassName =
  'flex size-[48px] shrink-0 items-center justify-center rounded-[var(--snackbar-radius)]';

export const iconClassName = 'size-[24px] shrink-0';

export const messageContainerClassName = 'min-w-0 flex-1';

export const titleClassName =
  'break-words text-[length:var(--subtitle2-size-desktop)] leading-[var(--subtitle2-line-height-desktop)] font-[var(--subtitle2-weight)]';

export const descriptionClassName =
  'mt-[2px] text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] font-[var(--body2-weight)]';

export const descriptionOnlyClassName =
  'break-words text-[length:var(--subtitle2-size-desktop)] leading-[var(--subtitle2-line-height-desktop)] font-[var(--subtitle2-weight)]';

export const closeButtonClassName =
  'absolute top-0 right-0 z-10 inline-flex cursor-pointer items-center justify-center rounded-[var(--snackbar-radius)] p-[var(--space-1)] text-[var(--action-active)] outline-none transition-[background-color,color,box-shadow] hover:bg-[var(--color-grey-8)] focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60';

export const closeButtonInnerClassName =
  'inline-flex size-[20px] items-center justify-center rounded-[var(--radius-50)] border border-[var(--color-grey-16)]';

export const closeIconClassName = 'size-[12px]';
