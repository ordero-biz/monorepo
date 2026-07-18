'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';
import { cn } from '@/ui/lib/utils';
import type { IconButtonProps } from './types';

const iconButtonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[var(--icon-button-radius)] border border-transparent bg-transparent text-[var(--text-primary)] outline-none transition-[background-color,color,box-shadow] [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]',
  {
    variants: {
      color: {
        default: '',
        inherit: '',
        primary: '',
        secondary: '',
        info: '',
        success: '',
        warning: '',
        error: '',
      },
      size: {
        xs: 'size-[var(--icon-button-xs-size)]',
        s: 'size-[var(--icon-button-sm-size)]',
        m: 'size-[var(--icon-button-md-size)]',
        l: 'size-[var(--icon-button-lg-size)]',
      },
      variant: {
        soft: '',
        text: '',
      },
    },
    compoundVariants: [
      {
        color: 'default',
        variant: 'text',
        class: 'text-[var(--grey-600)] hover:bg-grey-8',
      },
      {
        color: 'inherit',
        variant: 'text',
        class: 'text-foreground hover:bg-grey-8',
      },
      {
        color: 'primary',
        variant: 'text',
        class: 'text-primary hover:bg-primary-8',
      },
      {
        color: 'secondary',
        variant: 'text',
        class: 'text-[var(--secondary-main)] hover:bg-secondary-8',
      },
      {
        color: 'info',
        variant: 'text',
        class: 'text-info-main hover:bg-info-8',
      },
      {
        color: 'success',
        variant: 'text',
        class: 'text-success-main hover:bg-success-8',
      },
      {
        color: 'warning',
        variant: 'text',
        class: 'text-warning-main hover:bg-warning-8',
      },
      {
        color: 'error',
        variant: 'text',
        class: 'text-error-main hover:bg-error-8',
      },
      {
        color: 'default',
        variant: 'soft',
        class:
          'bg-grey-8 text-[var(--grey-800)] hover:bg-grey-16 disabled:bg-grey-20',
      },
      {
        color: 'inherit',
        variant: 'soft',
        class: 'bg-grey-8 text-foreground hover:bg-grey-16 disabled:bg-grey-20',
      },
      {
        color: 'primary',
        variant: 'soft',
        class:
          'bg-primary-8 text-[var(--primary-dark)] hover:bg-primary-16 disabled:bg-grey-20',
      },
      {
        color: 'secondary',
        variant: 'soft',
        class:
          'bg-secondary-8 text-[var(--secondary-dark)] hover:bg-secondary-16 disabled:bg-grey-20',
      },
      {
        color: 'info',
        variant: 'soft',
        class:
          'bg-info-8 text-[var(--info-dark)] hover:bg-info-16 disabled:bg-grey-20',
      },
      {
        color: 'success',
        variant: 'soft',
        class:
          'bg-success-8 text-[var(--success-darker)] hover:bg-success-16 disabled:bg-grey-20',
      },
      {
        color: 'warning',
        variant: 'soft',
        class:
          'bg-warning-8 text-[var(--warning-darker)] hover:bg-warning-16 disabled:bg-grey-20',
      },
      {
        color: 'error',
        variant: 'soft',
        class:
          'bg-error-8 text-[var(--error-dark)] hover:bg-error-16 disabled:bg-grey-20',
      },
    ],
    defaultVariants: {
      color: 'default',
      size: 'm',
      variant: 'text',
    },
  }
);

const iconSizeClassNames = {
  l: 'size-[var(--icon-button-lg-icon)]',
  m: 'size-[var(--icon-button-md-icon)]',
  s: 'size-[var(--icon-button-sm-icon)]',
  xs: 'size-[var(--icon-button-xs-icon)]',
} as const;

export const IconButton = ({
  'aria-controls': ariaControls,
  'aria-describedby': ariaDescribedBy,
  'aria-expanded': ariaExpanded,
  'aria-haspopup': ariaHasPopup,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  color,
  disabled,
  form,
  id,
  name,
  onBlur,
  onClick,
  onFocus,
  onKeyDown,
  onMouseDown,
  onPointerDown,
  ref,
  size,
  tabIndex,
  title,
  type = 'button',
  variant,
}: IconButtonProps) => {
  const iconClassName = iconSizeClassNames[size ?? 'm'];

  return (
    <ButtonPrimitive
      ref={ref}
      aria-controls={ariaControls}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHasPopup}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(iconButtonVariants({ color, size, variant }))}
      data-slot="icon-button"
      disabled={disabled}
      form={form}
      id={id}
      name={name}
      onBlur={onBlur}
      onClick={onClick}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      onPointerDown={onPointerDown}
      tabIndex={tabIndex}
      title={title}
      type={type}
    >
      <span
        className={cn(
          'inline-flex items-center justify-center [&_svg]:size-full',
          iconClassName
        )}
      >
        {children}
      </span>
    </ButtonPrimitive>
  );
};
