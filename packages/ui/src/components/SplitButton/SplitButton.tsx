'use client';

import { cva } from 'class-variance-authority';
import { useEffect, useState } from 'react';
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
}: SplitButtonRootProps) => {
  const isOpenControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(
    defaultOpen ?? false
  );
  const requestedOpen = isOpenControlled ? open : uncontrolledOpen;

  useEffect(() => {
    if (!disabled || !requestedOpen) {
      return;
    }

    if (!isOpenControlled) {
      setUncontrolledOpen(false);
    }

    onOpenChange?.(false);
  }, [disabled, isOpenControlled, onOpenChange, requestedOpen]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isOpenControlled) {
      setUncontrolledOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  return (
    <SplitButtonContext value={{ color, disabled, fullWidth, size, variant }}>
      <Menu.Root
        disabled={disabled}
        onOpenChange={handleOpenChange}
        open={disabled ? false : requestedOpen}
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
};
