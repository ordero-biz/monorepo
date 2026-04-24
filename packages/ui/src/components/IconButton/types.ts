import type {
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
} from 'react';

export type IconButtonColor =
  | 'default'
  | 'inherit'
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type IconButtonSize = 'xs' | 's' | 'm' | 'l';

export type IconButtonProps = {
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  children?: ReactNode;
  color?: IconButtonColor;
  disabled?: boolean;
  form?: string;
  id?: string;
  name?: string;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  size?: IconButtonSize;
  tabIndex?: number;
  title?: string;
  type?: 'button' | 'reset' | 'submit';
};
