'use client';

import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import { Menu } from '@/ui/components/Menu';
import { useSplitButtonContext } from './SplitButtonContext';
import type { SplitButtonTriggerProps } from './types';

const triggerVariants = cva(
  'inline-flex shrink-0 [&>button]:relative [&>button]:min-w-0 [&>button]:rounded-s-none [&>button]:px-0 [&>button]:focus-visible:z-10',
  {
    variants: {
      size: {
        l: '[&>button]:w-[var(--button-lg-height)]',
        m: '[&>button]:w-[var(--button-md-height)]',
        s: '[&>button]:w-[var(--button-sm-height)]',
      },
      variant: {
        contained: '[&>button]:border-s-grey-24',
        outlined: '',
        soft: '[&>button]:border-s-grey-24',
        text: '[&>button]:border-s-grey-24',
      },
    },
  }
);

export const SplitButtonTrigger = ({
  'aria-label': ariaLabel,
  disabled,
  id,
  title,
}: SplitButtonTriggerProps) => {
  const context = useSplitButtonContext();

  return (
    <span
      className={triggerVariants({
        size: context.size,
        variant: context.variant,
      })}
    >
      <Menu.Trigger
        aria-label={ariaLabel}
        color={context.color}
        disabled={context.disabled || disabled}
        id={id}
        size={context.size}
        startIcon={<ChevronDown aria-hidden="true" />}
        title={title}
        variant={context.variant}
      />
    </span>
  );
};
