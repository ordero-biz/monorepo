import type {
  AriaAttributes,
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  PointerEventHandler,
  ReactNode,
  Ref,
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
  'aria-controls'?: AriaAttributes['aria-controls'];
  'aria-describedby'?: string;
  'aria-expanded'?: AriaAttributes['aria-expanded'];
  'aria-haspopup'?: AriaAttributes['aria-haspopup'];
  'aria-label'?: string;
  'aria-labelledby'?: string;
  children?: ReactNode;
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
  onMouseDown?: MouseEventHandler<HTMLButtonElement>;
  onPointerDown?: PointerEventHandler<HTMLButtonElement>;
  ref?: Ref<HTMLElement>;
  size?: ButtonSize;
  startIcon?: ReactNode;
  tabIndex?: number;
  title?: string;
  type?: 'button' | 'reset' | 'submit';
  variant?: ButtonVariant;
};
