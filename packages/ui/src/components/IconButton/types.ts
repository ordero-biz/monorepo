import type {
  AriaAttributes,
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  PointerEventHandler,
  ReactNode,
  Ref,
} from 'react';

export type IconButtonColor =
  | 'default'
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type IconButtonSize = 'xs' | 's' | 'm' | 'l';

export type IconButtonVariant = 'text' | 'soft';

export type IconButtonProps = {
  'aria-controls'?: AriaAttributes['aria-controls'];
  'aria-describedby'?: string;
  'aria-expanded'?: AriaAttributes['aria-expanded'];
  'aria-haspopup'?: AriaAttributes['aria-haspopup'];
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
  onMouseDown?: MouseEventHandler<HTMLButtonElement>;
  onPointerDown?: PointerEventHandler<HTMLButtonElement>;
  ref?: Ref<HTMLElement>;
  size?: IconButtonSize;
  tabIndex?: number;
  title?: string;
  type?: 'button' | 'reset' | 'submit';
  variant?: IconButtonVariant;
};
