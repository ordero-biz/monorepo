'use client';

import { Input as InputPrimitive } from '@base-ui/react/input';
import { cn } from '@ordero/ui/lib/utils';
import { INPUT_DEFAULTS, inputVariants } from './constants';
import type { InputProps } from './types';

function Input({ className, type, variant, size, ...props }: InputProps) {
  const resolvedVariant = variant ?? INPUT_DEFAULTS.variant;
  const resolvedSize = size ?? INPUT_DEFAULTS.size;

  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      className={cn(
        inputVariants({ variant: resolvedVariant, size: resolvedSize }),
        className
      )}
      {...props}
    />
  );
}

export { Input };
