import type { Input as InputPrimitive } from '@base-ui/react/input';
import type { VariantProps } from 'class-variance-authority';
import type { inputVariants } from './constants';

export type InputProps = Omit<InputPrimitive.Props, 'size'> &
  VariantProps<typeof inputVariants>;
