'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cn } from '../../lib/utils';
import { buttonVariants } from './constants';
import { resolveButtonStyle } from './resolve-button-style';
import type { ButtonProps } from './types';

export const Button = ({
  className,
  variant,
  color: colorProp,
  size,
  fullWidth,
  rounded,
  loading,
  elevated,
  ...props
}: ButtonProps) => {
  const { appearance, color } = resolveButtonStyle(variant, colorProp);

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({
          appearance,
          color,
          size,
          fullWidth,
          rounded,
          loading,
          elevated,
        }),
        className
      )}
      {...props}
    />
  );
};
