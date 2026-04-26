import type { CheckboxRootChangeEventDetails } from '@base-ui/react/checkbox';
import type {
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  Ref,
} from 'react';

export type CheckboxColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type CheckboxSize = 's' | 'm';

export type CheckboxProps = {
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  checked?: boolean;
  children?: ReactNode;
  color?: CheckboxColor;
  defaultChecked?: boolean;
  disabled?: boolean;
  id?: string;
  indeterminate?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  name?: string;
  onBlur?: FocusEventHandler<HTMLElement>;
  onCheckedChange?: (
    checked: boolean,
    details: CheckboxRootChangeEventDetails
  ) => void;
  onClick?: MouseEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  readOnly?: boolean;
  required?: boolean;
  size?: CheckboxSize;
  tabIndex?: number;
  title?: string;
  uncheckedValue?: string;
  value?: string;
};
