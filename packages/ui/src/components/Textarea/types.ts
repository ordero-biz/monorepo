import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import type { textareaVariants } from './constants';

export type TextareaProps = ComponentProps<'textarea'> &
  VariantProps<typeof textareaVariants>;
