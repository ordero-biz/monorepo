import type * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import type { textareaVariants } from './constants';

export type TextareaProps = React.ComponentProps<'textarea'> &
  VariantProps<typeof textareaVariants>;
