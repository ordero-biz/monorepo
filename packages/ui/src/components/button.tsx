'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';

import {
  type ButtonVariantProps,
  buttonVariants,
} from '../lib/button-variants';
import { cn } from '../lib/utils';

export interface ButtonProps
  extends ButtonPrimitive.Props,
    ButtonVariantProps {}

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
