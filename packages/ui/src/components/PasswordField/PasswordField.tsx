'use client';

import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { IconButton } from '@/ui/components/IconButton';
import { TextField } from '@/ui/components/TextField';
import type { PasswordFieldProps } from './types';

const iconButtonSizeByFieldSize = {
  m: 'm',
  s: 's',
} as const;

export const PasswordField = forwardRef<HTMLElement, PasswordFieldProps>(
  (
    {
      defaultVisible = false,
      disabled = false,
      hidePasswordLabel = 'Hide password',
      showPasswordLabel = 'Show password',
      size = 'm',
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = useState(defaultVisible);

    return (
      <TextField
        {...props}
        disabled={disabled}
        endAdornment={
          <IconButton
            aria-label={visible ? hidePasswordLabel : showPasswordLabel}
            color="default"
            disabled={disabled}
            onClick={() => setVisible((current) => !current)}
            size={iconButtonSizeByFieldSize[size]}
            type="button"
          >
            {visible ? <EyeOff /> : <Eye />}
          </IconButton>
        }
        ref={ref}
        size={size}
        type={visible ? 'text' : 'password'}
      />
    );
  }
);

PasswordField.displayName = 'PasswordField';
