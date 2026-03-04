'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cn } from '@/ui/lib/utils';
import { buttonVariants } from './constants';
import type { ButtonProps } from './types';

export const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};
