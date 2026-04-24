'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '@/ui/lib/utils';
import type { IconButtonProps } from './types';

const iconButtonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[var(--icon-button-radius)] border border-transparent bg-transparent text-[var(--text-primary)] outline-none transition-[background-color,color,box-shadow] [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]',
  {
    variants: {
      color: {
        default: 'text-[var(--grey-600)] hover:bg-[var(--figma-grey-8)]',
        inherit: 'text-foreground hover:bg-[var(--figma-grey-8)]',
        primary: 'text-primary hover:bg-primary-8',
        info: 'text-info-main hover:bg-info-8',
        success: 'text-success-main hover:bg-success-8',
        warning: 'text-warning-main hover:bg-warning-8',
        error: 'text-error-main hover:bg-error-8',
      },
      size: {
        xs: 'size-[var(--icon-button-xs-size)]',
        s: 'size-[var(--icon-button-sm-size)]',
        m: 'size-[var(--icon-button-md-size)]',
        l: 'size-[var(--icon-button-lg-size)]',
      },
    },
    defaultVariants: {
      color: 'default',
      size: 'm',
    },
  }
);

const iconSizeClassNames = {
  l: 'size-[var(--icon-button-lg-icon)]',
  m: 'size-[var(--icon-button-md-icon)]',
  s: 'size-[var(--icon-button-sm-icon)]',
  xs: 'size-[var(--icon-button-xs-icon)]',
} as const;

export const IconButton = forwardRef<HTMLElement, IconButtonProps>(
  (
    {
      'aria-describedby': ariaDescribedBy,
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
      size,
      tabIndex,
      title,
      type = 'button',
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
        className={cn(iconButtonVariants({ color, size }))}
        data-slot="icon-button"
        disabled={disabled}
        form={form}
        id={id}
        name={name}
        onBlur={onBlur}
        onClick={onClick}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
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
  }
);

IconButton.displayName = 'IconButton';

export { iconButtonVariants };
