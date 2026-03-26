import { cva } from 'class-variance-authority';

export const INPUT_DEFAULTS = {
  size: 'md',
  variant: 'outline',
  state: 'default',
} as const;

/** Minimal UI text field — Figma Minimal_Web “Text field” */
export const inputVariants = cva(
  [
    'flex w-full min-w-0 outline-none transition-all duration-200 ease-out',
    'text-[length:var(--input-value-size)] leading-[length:var(--input-value-line-height)]',
    'text-foreground placeholder:text-muted-foreground',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--action-disabled-bg)]',
    'aria-invalid:border-error aria-invalid:ring-2 aria-invalid:ring-error/20 aria-invalid:focus-visible:border-error aria-invalid:focus-visible:ring-error/20',
  ].join(' '),
  {
    variants: {
      variant: {
        outline: [
          'rounded-[length:var(--textfield-radius)] border border-[var(--textfield-outline)]',
          'bg-background shadow-none',
          'hover:border-[var(--textfield-outline-strong)]',
          'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:shadow-md',
          'disabled:border-[var(--textfield-outline)]',
        ].join(' '),
        filled: [
          'rounded-[length:var(--textfield-radius)] border-0',
          'bg-[var(--textfield-filled-bg)] shadow-none',
          'hover:bg-[var(--textfield-filled-bg-hover)]',
          'focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-0',
          'disabled:bg-[var(--textfield-filled-bg)]',
        ].join(' '),
        underline: [
          'rounded-none border-0 border-b-2 border-[var(--textfield-underline)] bg-transparent px-0 shadow-none',
          'hover:border-[var(--textfield-underline-strong)]',
          'focus-visible:border-primary focus-visible:ring-0 focus-visible:shadow-none',
        ].join(' '),
      },
      size: {
        md: '',
        sm: '',
      },
      state: {
        default: '',
        error:
          'border-error hover:border-error focus-visible:border-error focus-visible:ring-error/20',
        warning:
          'border-warning hover:border-warning focus-visible:border-warning focus-visible:ring-warning/20',
        success:
          'border-success hover:border-success focus-visible:border-success focus-visible:ring-success/20',
      },
    },
    compoundVariants: [
      {
        variant: 'outline',
        size: 'md',
        class:
          'h-[length:var(--textfield-height-outlined-md)] px-[length:var(--textfield-px-outlined)]',
      },
      {
        variant: 'outline',
        size: 'sm',
        class:
          'h-[length:var(--textfield-height-outlined-sm)] px-[length:var(--textfield-px-outlined)]',
      },
      {
        variant: 'filled',
        state: 'error',
        class:
          'bg-[var(--error-soft-bg)] hover:bg-[var(--error-soft-bg)] focus-visible:ring-error/25',
      },
      {
        variant: 'filled',
        state: 'warning',
        class:
          'bg-[var(--warning-soft-bg)] hover:bg-[var(--warning-soft-bg)] focus-visible:ring-warning/25',
      },
      {
        variant: 'filled',
        state: 'success',
        class:
          'bg-[var(--success-soft-bg)] hover:bg-[var(--success-soft-bg)] focus-visible:ring-success/25',
      },
      {
        variant: 'filled',
        size: 'md',
        class:
          'h-[length:var(--textfield-height-filled-md)] pl-[length:var(--textfield-pl-filled)] pr-[length:var(--textfield-pr-filled)]',
      },
      {
        variant: 'filled',
        size: 'sm',
        class:
          'h-[length:var(--textfield-height-outlined-sm)] pl-[length:var(--textfield-pl-filled)] pr-[length:var(--textfield-pr-filled)]',
      },
      {
        variant: 'underline',
        size: 'md',
        class:
          'h-[length:var(--textfield-height-standard-md)] pt-[length:var(--textfield-standard-pt-md)] pb-[length:var(--textfield-standard-pb)]',
      },
      {
        variant: 'underline',
        size: 'sm',
        class:
          'h-[length:var(--textfield-height-standard-sm)] pt-[length:var(--textfield-standard-pt-sm)] pb-[length:var(--textfield-standard-pb)]',
      },
    ],
    defaultVariants: {
      variant: 'outline',
      size: 'md',
      state: 'default',
    },
  }
);
