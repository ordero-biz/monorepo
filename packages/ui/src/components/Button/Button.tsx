'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '@/ui/lib/utils';
import type { ButtonProps } from './types';

const buttonVariants = cva(
  'inline-flex min-w-[var(--button-min-width)] shrink-0 items-center justify-center gap-[var(--button-spacing)] whitespace-nowrap rounded-[var(--button-radius)] border border-transparent font-bold outline-none transition-[background-color,border-color,color,box-shadow] [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:shadow-none',
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
          'bg-foreground text-background hover:bg-[var(--grey-700)] disabled:border-transparent disabled:bg-[var(--figma-grey-20)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'primary',
        variant: 'contained',
        class:
          'bg-[var(--primary-main)] text-[var(--figma-primary-contrast-text)] hover:bg-[var(--primary-dark)] disabled:border-transparent disabled:bg-[var(--figma-grey-20)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'secondary',
        variant: 'contained',
        class:
          'bg-[var(--secondary-main)] text-[var(--figma-secondary-contrast-text)] hover:bg-[var(--secondary-dark)] disabled:border-transparent disabled:bg-[var(--figma-grey-20)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'info',
        variant: 'contained',
        class:
          'bg-[var(--info-main)] text-[var(--figma-info-contrast-text)] hover:bg-[var(--info-dark)] disabled:border-transparent disabled:bg-[var(--figma-grey-20)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'success',
        variant: 'contained',
        class:
          'bg-[var(--success-main)] text-[var(--figma-success-contrast-text)] hover:bg-[var(--success-dark)] disabled:border-transparent disabled:bg-[var(--figma-grey-20)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'warning',
        variant: 'contained',
        class:
          'bg-[var(--warning-main)] text-[var(--figma-warning-contrast-text)] hover:bg-[var(--warning-dark)] disabled:border-transparent disabled:bg-[var(--figma-grey-20)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'error',
        variant: 'contained',
        class:
          'bg-[var(--error-main)] text-[var(--figma-error-contrast-text)] hover:bg-[var(--error-dark)] disabled:border-transparent disabled:bg-[var(--figma-grey-20)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'inherit',
        variant: 'outlined',
        class:
          'border-[var(--figma-button-outlined)] text-foreground hover:bg-[var(--figma-grey-8)] disabled:border-[var(--figma-grey-24)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'primary',
        variant: 'outlined',
        class:
          'border-[var(--figma-primary-48)] text-[var(--primary-main)] hover:border-[var(--primary-main)] hover:bg-[var(--figma-primary-8)] disabled:border-[var(--figma-grey-24)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'secondary',
        variant: 'outlined',
        class:
          'border-[var(--figma-secondary-48)] text-[var(--secondary-main)] hover:border-[var(--secondary-main)] hover:bg-[var(--figma-secondary-8)] disabled:border-[var(--figma-grey-24)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'info',
        variant: 'outlined',
        class:
          'border-[var(--figma-info-48)] text-[var(--info-main)] hover:border-[var(--info-main)] hover:bg-[var(--figma-info-8)] disabled:border-[var(--figma-grey-24)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'success',
        variant: 'outlined',
        class:
          'border-[var(--figma-success-48)] text-[var(--success-main)] hover:border-[var(--success-main)] hover:bg-[var(--figma-success-8)] disabled:border-[var(--figma-grey-24)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'warning',
        variant: 'outlined',
        class:
          'border-[var(--figma-warning-48)] text-[var(--warning-main)] hover:border-[var(--warning-main)] hover:bg-[var(--figma-warning-8)] disabled:border-[var(--figma-grey-24)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'error',
        variant: 'outlined',
        class:
          'border-[var(--figma-error-48)] text-[var(--error-main)] hover:border-[var(--error-main)] hover:bg-[var(--figma-error-8)] disabled:border-[var(--figma-grey-24)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'inherit',
        variant: 'text',
        class:
          'text-foreground hover:bg-[var(--figma-grey-8)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'primary',
        variant: 'text',
        class:
          'text-[var(--primary-main)] hover:bg-[var(--figma-primary-8)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'secondary',
        variant: 'text',
        class:
          'text-[var(--secondary-main)] hover:bg-[var(--figma-secondary-8)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'info',
        variant: 'text',
        class:
          'text-[var(--info-main)] hover:bg-[var(--figma-info-8)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'success',
        variant: 'text',
        class:
          'text-[var(--success-main)] hover:bg-[var(--figma-success-8)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'warning',
        variant: 'text',
        class:
          'text-[var(--warning-main)] hover:bg-[var(--figma-warning-8)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'error',
        variant: 'text',
        class:
          'text-[var(--error-main)] hover:bg-[var(--figma-error-8)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'inherit',
        variant: 'soft',
        class:
          'bg-[var(--figma-grey-8)] text-foreground hover:bg-[var(--figma-grey-16)] disabled:bg-[var(--figma-grey-20)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'primary',
        variant: 'soft',
        class:
          'bg-[var(--figma-primary-8)] text-[var(--primary-dark)] hover:bg-[var(--figma-primary-16)] disabled:bg-[var(--figma-grey-20)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'secondary',
        variant: 'soft',
        class:
          'bg-[var(--figma-secondary-8)] text-[var(--secondary-dark)] hover:bg-[var(--figma-secondary-16)] disabled:bg-[var(--figma-grey-20)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'info',
        variant: 'soft',
        class:
          'bg-[var(--figma-info-8)] text-[var(--info-dark)] hover:bg-[var(--figma-info-16)] disabled:bg-[var(--figma-grey-20)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'success',
        variant: 'soft',
        class:
          'bg-[var(--figma-success-8)] text-[var(--success-dark)] hover:bg-[var(--figma-success-16)] disabled:bg-[var(--figma-grey-20)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'warning',
        variant: 'soft',
        class:
          'bg-[var(--figma-warning-8)] text-[var(--warning-dark)] hover:bg-[var(--figma-warning-16)] disabled:bg-[var(--figma-grey-20)] disabled:text-[var(--text-disabled)]',
      },
      {
        color: 'error',
        variant: 'soft',
        class:
          'bg-[var(--figma-error-8)] text-[var(--error-dark)] hover:bg-[var(--figma-error-16)] disabled:bg-[var(--figma-grey-20)] disabled:text-[var(--text-disabled)]',
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

const iconSizeClassNames = {
  l: 'size-[var(--button-lg-icon)]',
  m: 'size-[var(--button-md-icon)]',
  s: 'size-[var(--button-sm-icon)]',
} as const;

export const Button = forwardRef<HTMLElement, ButtonProps>(
  (
    {
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      className,
      color,
      disabled,
      endIcon,
      form,
      fullWidth,
      id,
      name,
      onBlur,
      onClick,
      onFocus,
      onKeyDown,
      size,
      startIcon,
      tabIndex,
      title,
      type = 'button',
      variant,
    },
    ref
  ) => {
    const iconClassName = iconSizeClassNames[size ?? 'm'];

    return (
      <ButtonPrimitive
        ref={ref}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        type={type}
        disabled={disabled}
        data-slot="button"
        form={form}
        id={id}
        name={name}
        onBlur={onBlur}
        onClick={onClick}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        title={title}
        className={cn(
          buttonVariants({ color, fullWidth, size, variant }),
          className
        )}
      >
        {startIcon ? (
          <span className={cn(iconClassName)}>{startIcon}</span>
        ) : null}
        {children}
        {endIcon ? <span className={cn(iconClassName)}>{endIcon}</span> : null}
      </ButtonPrimitive>
    );
  }
);

Button.displayName = 'Button';

export { buttonVariants };
