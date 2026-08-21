import type {
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  Ref,
} from 'react';

export type RadioColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type RadioSize = 's' | 'm';

export type RadioAlignment = 'start' | 'center' | 'end';

export type RadioProps = {
  align?: RadioAlignment;
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  children?: ReactNode;
  color?: RadioColor;
  disabled?: boolean;
  id?: string;
  inputRef?: Ref<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLElement>;
  onClick?: MouseEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  readOnly?: boolean;
  ref?: Ref<HTMLElement>;
  required?: boolean;
  size?: RadioSize;
  tabIndex?: number;
  title?: string;
  value: string;
};
