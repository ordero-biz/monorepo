import type { Toggle } from '@base-ui/react/toggle';
import type { ToggleGroup } from '@base-ui/react/toggle-group';
import type {
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  Ref,
} from 'react';

export type ToggleButtonColor =
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type ToggleButtonSize = 's' | 'm' | 'l';

export type ToggleButtonOrientation = 'horizontal' | 'vertical';

export type ToggleButtonGroupProps = {
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  children?: ReactNode;
  color?: ToggleButtonColor;
  defaultValue?: readonly string[];
  disabled?: boolean;
  id?: string;
  loopFocus?: boolean;
  multiple?: boolean;
  onValueChange?: (
    value: string[],
    details: ToggleGroup.ChangeEventDetails
  ) => void;
  orientation?: ToggleButtonOrientation;
  ref?: Ref<HTMLDivElement>;
  size?: ToggleButtonSize;
  value?: readonly string[];
};

export type ToggleButtonItemProps = {
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  children?: ReactNode;
  color?: ToggleButtonColor;
  defaultPressed?: boolean;
  disabled?: boolean;
  form?: string;
  icon?: ReactNode;
  id?: string;
  name?: string;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  onPressedChange?: (
    pressed: boolean,
    details: Toggle.ChangeEventDetails
  ) => void;
  pressed?: boolean;
  ref?: Ref<HTMLButtonElement>;
  size?: ToggleButtonSize;
  tabIndex?: number;
  title?: string;
  type?: 'button' | 'reset' | 'submit';
  value?: string;
};
