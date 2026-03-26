import { cva } from 'class-variance-authority';

export const TEXTAREA_DEFAULTS = {} as const;

export const textareaVariants = cva(
  [
    'flex w-full min-w-0 field-sizing-content outline-none transition-all duration-200 ease-out',
    'text-[length:var(--input-value-size)] leading-[length:var(--input-value-line-height)]',
    'text-foreground placeholder:text-muted-foreground',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--action-disabled-bg)]',
    'aria-invalid:border-error aria-invalid:ring-2 aria-invalid:ring-error/20',
    'rounded-[length:var(--textfield-radius)]',
    'min-h-[length:var(--textarea-min-height)]',
    'px-[length:var(--textarea-px-outlined)] py-[length:var(--textarea-py-outlined)]',
    'border border-[var(--textfield-outline)] bg-background shadow-none',
    'hover:border-[var(--textfield-outline-strong)]',
    'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:shadow-md',
  ].join(' ')
);
