import type { Button } from '@ordero/ui/components/Button';
import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';

export type InputGroupProps = React.ComponentProps<'div'>;

export type InputGroupAddonVariantProps = VariantProps<
  typeof import('./constants').inputGroupAddonVariants
>;

export type InputGroupAddonProps = React.ComponentProps<'div'> &
  InputGroupAddonVariantProps;

export type InputGroupButtonVariantProps = VariantProps<
  typeof import('./constants').inputGroupButtonVariants
>;

export type InputGroupButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  'size' | 'type'
> &
  InputGroupButtonVariantProps & {
    type?: 'button' | 'submit' | 'reset';
  };

export type InputGroupTextProps = React.ComponentProps<'span'>;

export type InputGroupInputProps = React.ComponentProps<'input'>;

export type InputGroupTextareaProps = React.ComponentProps<'textarea'>;
