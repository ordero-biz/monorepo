'use client';

import { cva } from 'class-variance-authority';
import { Menu } from '@/ui/components/Menu';
import { SplitButtonContext } from './SplitButtonContext';
import type { SplitButtonRootProps } from './types';

const splitButtonVariants = cva(
  'inline-flex items-stretch rounded-[var(--button-radius)]',
  {
    variants: {
      fullWidth: {
        false: 'w-fit',
        true: 'w-full',
      },
    },
  }
);

export const SplitButtonRoot = ({
  'aria-label': ariaLabel,
  children,
  color = 'inherit',
  defaultOpen,
  disabled = false,
  fullWidth = false,
  onOpenChange,
  open,
  size = 'm',
  variant = 'contained',
}: SplitButtonRootProps) => (
  <SplitButtonContext value={{ color, disabled, fullWidth, size, variant }}>
    <Menu.Root
      defaultOpen={defaultOpen}
      disabled={disabled}
      onOpenChange={onOpenChange}
      open={open}
    >
      <fieldset
        aria-label={ariaLabel}
        className={splitButtonVariants({ fullWidth })}
      >
        {children}
      </fieldset>
    </Menu.Root>
  </SplitButtonContext>
);
