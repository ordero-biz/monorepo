import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import type { Button } from '../Button';
import type { Input } from '../Input';
import type { Textarea } from '../Textarea';

export type InputGroupState = 'default' | 'error' | 'warning' | 'success';

export type InputGroupProps = ComponentProps<'div'> & {
  state?: InputGroupState;
};

export type InputGroupAddonVariantProps = VariantProps<
  typeof import('./constants').inputGroupAddonVariants
>;

export type InputGroupAddonProps = ComponentProps<'div'> &
  InputGroupAddonVariantProps;

export type InputGroupButtonVariantProps = VariantProps<
  typeof import('./constants').inputGroupButtonVariants
>;

export type InputGroupButtonProps = Omit<
  ComponentProps<typeof Button>,
  'size' | 'type'
> &
  InputGroupButtonVariantProps & {
    type?: 'button' | 'submit' | 'reset';
  };

export type InputGroupTextProps = ComponentProps<'span'>;

export type InputGroupInputProps = ComponentProps<typeof Input> & {
  state?: InputGroupState;
};

export type InputGroupTextareaProps = ComponentProps<typeof Textarea> & {
  state?: InputGroupState;
};
