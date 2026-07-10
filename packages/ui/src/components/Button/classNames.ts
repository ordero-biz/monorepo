import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex min-w-[var(--button-min-width)] shrink-0 cursor-pointer items-center justify-center gap-[var(--button-spacing)] whitespace-nowrap rounded-[var(--button-radius)] border border-transparent font-bold outline-none transition-[background-color,border-color,color,box-shadow] [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:shadow-none',
  {
    variants: {
      color: {
        error: '',
        info: '',
        inherit: '',
        primary: '',
        secondary: '',
        success: '',
        warning: '',
      },
      fullWidth: {
        false: '',
        true: 'w-full',
      },
      size: {
        l: 'h-[var(--button-lg-height)] px-[var(--button-lg-px)] text-[length:var(--button-large-size-desktop)] leading-[var(--button-large-line-height-desktop)] font-[var(--button-large-weight)]',
        m: 'h-[var(--button-md-height)] px-[var(--button-md-px)] text-[length:var(--button-medium-size-desktop)] leading-[var(--button-medium-line-height-desktop)] font-[var(--button-medium-weight)]',
        s: 'h-[var(--button-sm-height)] px-[var(--button-sm-px)] text-[length:var(--button-small-size-desktop)] leading-[var(--button-small-line-height-desktop)] font-[var(--button-small-weight)]',
      },
      variant: {
        contained: '',
        outlined: 'border-[1.5px] bg-transparent',
        soft: '',
        text: 'bg-transparent',
      },
    },
    compoundVariants: [
      {
        size: 's',
        variant: 'text',
        class: 'px-[var(--button-text-variant-sm-px)]',
      },
      {
        size: 'm',
        variant: 'text',
        class: 'px-[var(--button-text-variant-md-px)]',
      },
      {
        size: 'l',
        variant: 'text',
        class: 'px-[var(--button-text-variant-lg-px)]',
      },
      {
        color: 'inherit',
        variant: 'contained',
        class:
          'bg-foreground text-background hover:bg-[var(--grey-700)] disabled:border-transparent disabled:bg-grey-20 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'primary',
        variant: 'contained',
        class:
          'bg-[var(--primary-dark)] text-primary-foreground hover:bg-[var(--primary-darker)] disabled:border-transparent disabled:bg-grey-20 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'secondary',
        variant: 'contained',
        class:
          'bg-[var(--secondary-main)] text-white hover:bg-[var(--secondary-dark)] disabled:border-transparent disabled:bg-grey-20 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'info',
        variant: 'contained',
        class:
          'bg-[var(--info-dark)] text-white hover:bg-[var(--info-darker)] disabled:border-transparent disabled:bg-grey-20 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'success',
        variant: 'contained',
        class:
          'bg-[var(--success-darker)] text-white hover:bg-[var(--success-dark)] disabled:border-transparent disabled:bg-grey-20 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'warning',
        variant: 'contained',
        class:
          'bg-[var(--warning-main)] text-[var(--grey-800)] hover:bg-[var(--warning-dark)] disabled:border-transparent disabled:bg-grey-20 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'error',
        variant: 'contained',
        class:
          'bg-[var(--error-dark)] text-destructive-foreground hover:bg-[var(--error-darker)] disabled:border-transparent disabled:bg-grey-20 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'inherit',
        variant: 'outlined',
        class:
          'border-button-outlined text-foreground hover:bg-grey-8 disabled:border-grey-24 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'primary',
        variant: 'outlined',
        class:
          'border-[var(--primary-dark)] text-[var(--primary-dark)] hover:border-[var(--primary-dark)] hover:bg-primary-8 disabled:border-grey-24 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'secondary',
        variant: 'outlined',
        class:
          'border-secondary-48 text-[var(--secondary-main)] hover:border-[var(--secondary-main)] hover:bg-secondary-8 disabled:border-grey-24 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'info',
        variant: 'outlined',
        class:
          'border-[var(--info-dark)] text-[var(--info-dark)] hover:border-[var(--info-dark)] hover:bg-info-8 disabled:border-grey-24 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'success',
        variant: 'outlined',
        class:
          'border-[var(--success-darker)] text-[var(--success-darker)] hover:border-[var(--success-darker)] hover:bg-success-8 disabled:border-grey-24 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'warning',
        variant: 'outlined',
        class:
          'border-[var(--warning-darker)] text-[var(--warning-darker)] hover:border-[var(--warning-darker)] hover:bg-warning-8 disabled:border-grey-24 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'error',
        variant: 'outlined',
        class:
          'border-[var(--error-dark)] text-[var(--error-dark)] hover:border-[var(--error-dark)] hover:bg-error-8 disabled:border-grey-24 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'inherit',
        variant: 'text',
        class:
          'text-foreground hover:bg-grey-8 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'primary',
        variant: 'text',
        class:
          'text-[var(--primary-dark)] hover:bg-primary-8 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'secondary',
        variant: 'text',
        class:
          'text-[var(--secondary-main)] hover:bg-secondary-8 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'info',
        variant: 'text',
        class:
          'text-[var(--info-dark)] hover:bg-info-8 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'success',
        variant: 'text',
        class:
          'text-[var(--success-darker)] hover:bg-success-8 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'warning',
        variant: 'text',
        class:
          'text-[var(--warning-darker)] hover:bg-warning-8 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'error',
        variant: 'text',
        class:
          'text-[var(--error-dark)] hover:bg-error-8 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'inherit',
        variant: 'soft',
        class:
          'bg-grey-8 text-foreground hover:bg-grey-16 disabled:bg-grey-20 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'primary',
        variant: 'soft',
        class:
          'bg-primary-8 text-[var(--primary-dark)] hover:bg-primary-16 disabled:bg-grey-20 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'secondary',
        variant: 'soft',
        class:
          'bg-secondary-8 text-[var(--secondary-dark)] hover:bg-secondary-16 disabled:bg-grey-20 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'info',
        variant: 'soft',
        class:
          'bg-info-8 text-[var(--info-dark)] hover:bg-info-16 disabled:bg-grey-20 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'success',
        variant: 'soft',
        class:
          'bg-success-8 text-[var(--success-darker)] hover:bg-success-16 disabled:bg-grey-20 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'warning',
        variant: 'soft',
        class:
          'bg-warning-8 text-[var(--warning-darker)] hover:bg-warning-16 disabled:bg-grey-20 disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'error',
        variant: 'soft',
        class:
          'bg-error-8 text-[var(--error-dark)] hover:bg-error-16 disabled:bg-grey-20 disabled:text-[var(--text-disabled)]',
      },
    ],
    defaultVariants: {
      color: 'inherit',
      fullWidth: false,
      size: 'm',
      variant: 'contained',
    },
  }
);
