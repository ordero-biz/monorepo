'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cn } from '@/ui/lib/utils';
import { buttonVariants } from './classNames';
import type { ButtonProps } from './types';

const iconSizeClassNames = {
  l: 'size-[var(--button-lg-icon)]',
  m: 'size-[var(--button-md-icon)]',
  s: 'size-[var(--button-sm-icon)]',
} as const;

export const Button = ({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
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
  ref,
  size,
  startIcon,
  tabIndex,
  title,
  type = 'button',
  variant,
}: ButtonProps) => {
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
      className={cn(buttonVariants({ color, fullWidth, size, variant }))}
    >
      {startIcon ? (
        <span className={cn(iconClassName)}>{startIcon}</span>
      ) : null}
      {children}
      {endIcon ? <span className={cn(iconClassName)}>{endIcon}</span> : null}
    </ButtonPrimitive>
  );
};
