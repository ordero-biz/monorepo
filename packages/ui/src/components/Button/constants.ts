import { cva } from 'class-variance-authority';

const containedDefault =
  'bg-[var(--default-button)] text-[var(--default-button-foreground)] shadow-none hover:bg-[var(--default-button-dark)] hover:shadow-[var(--default-button-shadow)] disabled:bg-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-[var(--action-disabled-bg)] disabled:hover:shadow-none';

const containedPrimary =
  'bg-primary text-primary-foreground shadow-none hover:bg-[var(--primary-dark)] hover:shadow-[var(--primary-shadow)] disabled:bg-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-[var(--action-disabled-bg)] disabled:hover:shadow-none';

const containedSecondaryBrand =
  'bg-[var(--secondary-brand)] text-[var(--secondary-brand-foreground)] shadow-none hover:bg-[var(--secondary-brand-dark)] hover:shadow-[var(--secondary-brand-shadow)] disabled:bg-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-[var(--action-disabled-bg)] disabled:hover:shadow-none';

const containedInfo =
  'bg-info text-info-foreground shadow-none hover:bg-[var(--info-dark)] hover:shadow-[var(--info-shadow)] disabled:bg-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-[var(--action-disabled-bg)] disabled:hover:shadow-none';

const containedSuccess =
  'bg-success text-success-foreground shadow-none hover:bg-[var(--success-dark)] hover:shadow-[var(--success-shadow)] disabled:bg-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-[var(--action-disabled-bg)] disabled:hover:shadow-none';

const containedWarning =
  'bg-warning text-warning-foreground shadow-none hover:bg-[var(--warning-dark)] hover:shadow-[var(--warning-shadow)] disabled:bg-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-[var(--action-disabled-bg)] disabled:hover:shadow-none';

const containedError =
  'bg-error text-error-foreground shadow-none hover:bg-[var(--error-dark)] hover:shadow-[var(--error-shadow)] disabled:bg-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-[var(--action-disabled-bg)] disabled:hover:shadow-none';

const outlinedDefault =
  'border border-[var(--default-button-outline)] bg-transparent text-[var(--text-primary)] hover:border-[var(--default-button)] hover:bg-[var(--default-button-tint-8)] disabled:border-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-transparent';

const outlinedPrimary =
  'border border-[var(--primary-outline)] bg-transparent text-primary hover:border-primary hover:border-[1.5px] hover:bg-[var(--primary-soft-bg)] disabled:border-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-transparent';

const outlinedSecondaryBrand =
  'border border-[var(--secondary-brand-outline)] bg-transparent text-[var(--secondary-brand)] hover:border-[var(--secondary-brand)] hover:border-[1.5px] hover:bg-[var(--secondary-brand-soft-bg)] disabled:border-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-transparent';

const outlinedInfo =
  'border border-[var(--info-outline)] bg-transparent text-info hover:border-info hover:border-[1.5px] hover:bg-[var(--info-soft-bg)] disabled:border-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-transparent';

const outlinedSuccess =
  'border border-[var(--success-outline)] bg-transparent text-success hover:border-success hover:border-[1.5px] hover:bg-[var(--success-soft-bg)] disabled:border-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-transparent';

const outlinedWarning =
  'border border-[var(--warning-outline)] bg-transparent text-warning hover:border-warning hover:border-[1.5px] hover:bg-[var(--warning-soft-bg)] disabled:border-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-transparent';

const outlinedError =
  'border border-[var(--error-outline)] bg-transparent text-error hover:border-error hover:border-[1.5px] hover:bg-[var(--error-soft-bg)] disabled:border-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-transparent';

const textDefault =
  'border-0 bg-transparent text-[var(--text-primary)] shadow-none hover:bg-[var(--default-button-tint-8)] disabled:text-[var(--action-disabled)] disabled:hover:bg-transparent';

const textPrimary =
  'border-0 bg-transparent text-primary shadow-none hover:bg-[var(--primary-soft-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-transparent';

const textSecondaryBrand =
  'border-0 bg-transparent text-[var(--secondary-brand)] shadow-none hover:bg-[var(--secondary-brand-soft-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-transparent';

const textInfo =
  'border-0 bg-transparent text-info shadow-none hover:bg-[var(--info-soft-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-transparent';

const textSuccess =
  'border-0 bg-transparent text-success shadow-none hover:bg-[var(--success-soft-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-transparent';

const textWarning =
  'border-0 bg-transparent text-warning shadow-none hover:bg-[var(--warning-soft-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-transparent';

const textError =
  'border-0 bg-transparent text-error shadow-none hover:bg-[var(--error-soft-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-transparent';

const softDefault =
  'border-0 bg-[var(--default-button-soft-bg)] text-[var(--default-button-soft-fg)] shadow-none hover:bg-[var(--default-button-tint-16)] disabled:bg-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-[var(--action-disabled-bg)]';

const softPrimary =
  'border-0 bg-[var(--primary-soft-bg)] text-[var(--primary-soft-fg)] shadow-none hover:bg-[var(--primary-tint-16)] disabled:bg-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-[var(--action-disabled-bg)]';

const softSecondaryBrand =
  'border-0 bg-[var(--secondary-brand-soft-bg)] text-[var(--secondary-brand-soft-fg)] shadow-none hover:bg-[var(--secondary-brand-tint-16)] disabled:bg-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-[var(--action-disabled-bg)]';

const softInfo =
  'border-0 bg-[var(--info-soft-bg)] text-[var(--info-soft-fg)] shadow-none hover:bg-[var(--info-tint-16)] disabled:bg-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-[var(--action-disabled-bg)]';

const softSuccess =
  'border-0 bg-[var(--success-soft-bg)] text-[var(--success-soft-fg)] shadow-none hover:bg-[var(--success-tint-16)] disabled:bg-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-[var(--action-disabled-bg)]';

const softWarning =
  'border-0 bg-[var(--warning-soft-bg)] text-[var(--warning-soft-fg)] shadow-none hover:bg-[var(--warning-tint-16)] disabled:bg-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-[var(--action-disabled-bg)]';

const softError =
  'border-0 bg-[var(--error-soft-bg)] text-[var(--error-soft-fg)] shadow-none hover:bg-[var(--error-tint-16)] disabled:bg-[var(--action-disabled-bg)] disabled:text-[var(--action-disabled)] disabled:hover:bg-[var(--action-disabled-bg)]';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap font-bold transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
    'disabled:pointer-events-none',
    'gap-[length:var(--button-gap)] rounded-[length:var(--button-radius)] min-w-[length:var(--button-min-width)]',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    'select-none cursor-pointer',
  ].join(' '),
  {
    variants: {
      appearance: {
        contained: '',
        outlined: '',
        text: '',
        soft: '',
        surface:
          'border-0 bg-secondary text-secondary-foreground shadow-none hover:bg-secondary/80 disabled:opacity-50',
        link: 'h-auto min-h-0 min-w-0 justify-center border-0 bg-transparent p-0 font-bold text-primary shadow-none underline-offset-4 hover:underline disabled:no-underline disabled:opacity-50',
      },
      color: {
        default: '',
        primary: '',
        secondary: '',
        info: '',
        success: '',
        warning: '',
        error: '',
      },
      size: {
        lg: "h-[length:var(--button-height-lg)] px-[length:var(--button-px-lg)] text-[15px] leading-[26px] [&_svg:not([class*='size-'])]:size-6",
        md: "h-[length:var(--button-height-md)] px-[length:var(--button-px-md)] text-sm leading-6 [&_svg:not([class*='size-'])]:size-6",
        sm: "h-[length:var(--button-height-sm)] px-[length:var(--button-px-sm)] text-[13px] leading-[22px] [&_svg:not([class*='size-'])]:size-[18px]",
        xs: "h-6 gap-1 rounded-md px-1.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        icon: "h-10 w-10 min-w-0 p-0 [&_svg:not([class*='size-'])]:size-6",
        'icon-sm': "h-9 w-9 min-w-0 p-0 [&_svg:not([class*='size-'])]:size-5",
        'icon-xs':
          "size-6 min-w-0 rounded-md p-0 [&_svg:not([class*='size-'])]:size-3.5",
        'icon-lg':
          "h-[length:var(--button-height-lg)] w-[length:var(--button-height-lg)] min-w-0 p-0 [&_svg:not([class*='size-'])]:size-8",
      },
      fullWidth: {
        true: 'w-full',
      },
      rounded: {
        default: '',
        sm: 'rounded-md',
        full: 'rounded-full',
      },
      loading: {
        true: 'pointer-events-none opacity-70',
      },
      elevated: {
        true: 'shadow-md hover:shadow-lg',
      },
    },
    compoundVariants: [
      {
        appearance: 'contained',
        color: 'default',
        className: containedDefault,
      },
      {
        appearance: 'contained',
        color: 'primary',
        className: containedPrimary,
      },
      {
        appearance: 'contained',
        color: 'secondary',
        className: containedSecondaryBrand,
      },
      { appearance: 'contained', color: 'info', className: containedInfo },
      {
        appearance: 'contained',
        color: 'success',
        className: containedSuccess,
      },
      {
        appearance: 'contained',
        color: 'warning',
        className: containedWarning,
      },
      { appearance: 'contained', color: 'error', className: containedError },
      { appearance: 'outlined', color: 'default', className: outlinedDefault },
      { appearance: 'outlined', color: 'primary', className: outlinedPrimary },
      {
        appearance: 'outlined',
        color: 'secondary',
        className: outlinedSecondaryBrand,
      },
      { appearance: 'outlined', color: 'info', className: outlinedInfo },
      { appearance: 'outlined', color: 'success', className: outlinedSuccess },
      { appearance: 'outlined', color: 'warning', className: outlinedWarning },
      { appearance: 'outlined', color: 'error', className: outlinedError },
      { appearance: 'text', color: 'default', className: textDefault },
      { appearance: 'text', color: 'primary', className: textPrimary },
      { appearance: 'text', color: 'secondary', className: textSecondaryBrand },
      { appearance: 'text', color: 'info', className: textInfo },
      { appearance: 'text', color: 'success', className: textSuccess },
      { appearance: 'text', color: 'warning', className: textWarning },
      { appearance: 'text', color: 'error', className: textError },
      { appearance: 'soft', color: 'default', className: softDefault },
      { appearance: 'soft', color: 'primary', className: softPrimary },
      { appearance: 'soft', color: 'secondary', className: softSecondaryBrand },
      { appearance: 'soft', color: 'info', className: softInfo },
      { appearance: 'soft', color: 'success', className: softSuccess },
      { appearance: 'soft', color: 'warning', className: softWarning },
      { appearance: 'soft', color: 'error', className: softError },
      {
        appearance: 'link',
        size: 'lg',
        className:
          'px-[length:var(--button-text-px-lg)] py-2 text-[15px] leading-[26px]',
      },
      {
        appearance: 'link',
        size: 'md',
        className:
          'px-[length:var(--button-text-px-md)] py-1.5 text-sm leading-6',
      },
      {
        appearance: 'link',
        size: 'sm',
        className:
          'px-[length:var(--button-text-px-sm)] py-1 text-[13px] leading-[22px]',
      },
      {
        appearance: 'link',
        size: 'icon',
        className: "size-10 p-0 [&_svg:not([class*='size-'])]:size-6",
      },
      {
        appearance: 'link',
        size: 'icon-sm',
        className: "size-9 p-0 [&_svg:not([class*='size-'])]:size-5",
      },
      {
        appearance: 'link',
        size: 'icon-lg',
        className:
          "size-[length:var(--button-height-lg)] p-0 [&_svg:not([class*='size-'])]:size-8",
      },
      { appearance: 'contained', loading: true, className: 'shadow-none' },
      { size: 'icon', className: 'rounded-[length:var(--button-radius)]' },
      { size: 'icon-sm', className: 'rounded-[length:var(--button-radius)]' },
      { size: 'icon-xs', className: 'rounded-[length:var(--button-radius)]' },
      { size: 'icon-lg', className: 'rounded-[length:var(--button-radius)]' },
    ],
    defaultVariants: {
      appearance: 'contained',
      color: 'primary',
      size: 'md',
      rounded: 'default',
    },
  }
);
