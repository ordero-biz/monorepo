import type {
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
} from 'react';

export type ButtonVariant = 'contained' | 'outlined' | 'text' | 'soft';

export type ButtonColor =
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type ButtonSize = 's' | 'm' | 'l';

export type ButtonProps = {
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  children?: ReactNode;
  className?: string;
  color?: ButtonColor;
  disabled?: boolean;
  endIcon?: ReactNode;
  form?: string;
  fullWidth?: boolean;
  id?: string;
  name?: string;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  size?: ButtonSize;
  startIcon?: ReactNode;
  tabIndex?: number;
  title?: string;
  type?: 'button' | 'reset' | 'submit';
  variant?: ButtonVariant;
};
