'use client';

import { Button } from '@/ui/components/Button';
import { cn } from '@/ui/lib/utils';
import { useSplitButtonContext } from './SplitButtonContext';
import type { SplitButtonActionProps } from './types';

export const SplitButtonAction = ({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  disabled,
  endIcon,
  form,
  id,
  name,
  onBlur,
  onClick,
  onFocus,
  onKeyDown,
  ref,
  startIcon,
  title,
  type,
}: SplitButtonActionProps) => {
  const context = useSplitButtonContext();

  return (
    <span
      className={cn(
        'inline-flex [&>button]:relative [&>button]:rounded-e-none [&>button]:border-e-0 [&>button]:focus-visible:z-10',
        context.fullWidth && 'flex-1'
      )}
    >
      <Button
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        color={context.color}
        disabled={context.disabled || disabled}
        endIcon={endIcon}
        form={form}
        fullWidth={context.fullWidth}
        id={id}
        name={name}
        onBlur={onBlur}
        onClick={onClick}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        ref={ref}
        size={context.size}
        startIcon={startIcon}
        title={title}
        type={type}
        variant={context.variant}
      >
        {children}
      </Button>
    </span>
  );
};
