'use client';

import { Input as InputPrimitive } from '@base-ui/react/input';
import { cn } from '../../lib/utils';
import { INPUT_DEFAULTS, inputVariants } from './constants';
import type { InputProps } from './types';

function Input({
  className,
  type,
  variant,
  size,
  state,
  'aria-invalid': ariaInvalid,
  ...props
}: InputProps) {
  const resolvedVariant = variant ?? INPUT_DEFAULTS.variant;
  const resolvedSize = size ?? INPUT_DEFAULTS.size;
  const resolvedState = state ?? INPUT_DEFAULTS.state;
  const resolvedAriaInvalid =
    ariaInvalid ?? (resolvedState === 'error' || undefined);

  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      data-state={resolvedState}
      aria-invalid={resolvedAriaInvalid}
      className={cn(
        inputVariants({
          variant: resolvedVariant,
          size: resolvedSize,
          state: resolvedState,
        }),
        className
      )}
      {...props}
    />
  );
}

export { Input };
