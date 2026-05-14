export const rootClassName =
  'relative w-full rounded-[var(--dialog-radius)] bg-background text-foreground shadow-lg outline-none';

export const backdropClassName =
  'fixed inset-0 min-h-dvh bg-[var(--dialog-backdrop)] transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute';

export const viewportClassName =
  'fixed inset-0 z-50 grid place-items-center p-[var(--dialog-content-px)]';

export const popupClassName = `${rootClassName} p-[var(--dialog-content-px)] transition-all duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0`;

export const popupWidthClassNames = {
  md: 'max-w-[var(--dialog-width-md)]',
  sm: 'max-w-[var(--dialog-width-sm)]',
  xs: 'max-w-[var(--dialog-width-xs)]',
} as const;

export const popupFullScreenClassName =
  'max-w-none rounded-[var(--dialog-radius)] p-[var(--space-3)]';

export const contentClassName = 'min-h-0 mt-[var(--space-2)]';

export const contentScrollableClassName =
  'max-h-[70vh] overflow-y-auto pr-[2px] -mr-[2px] [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:var(--dialog-scrollbar-color)_transparent] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--dialog-scrollbar-color)]';

export const footerClassName =
  'mt-[var(--dialog-action-spacing)] -mx-[var(--dialog-content-px)] -mb-[var(--dialog-content-px)] flex items-center justify-end gap-[var(--dialog-action-spacing)] rounded-b-[var(--dialog-radius)] bg-[var(--background-paper)] px-[var(--dialog-action-px)] py-[var(--dialog-action-py)]';

export const titleClassName =
  'text-[length:var(--dialog-title-size)] leading-[var(--dialog-title-line-height)] font-[var(--dialog-title-weight)] text-foreground';

export const descriptionClassName =
  'mt-[var(--space-1)] text-[length:var(--body1-size-desktop)] leading-[var(--body1-line-height-desktop)] font-[var(--body1-weight)] text-[var(--text-secondary)]';
