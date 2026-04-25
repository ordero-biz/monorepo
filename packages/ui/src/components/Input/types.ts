import type { InputChangeEventDetails } from '@base-ui/react/input';
import type {
  ElementType,
  FocusEventHandler,
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
  KeyboardEventHandler,
  ReactNode,
} from 'react';

export type InputSize = 's' | 'm';
export type InputVariant = 'outlined' | 'filled';

export type InputProps = {
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  autoFocus?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  endAdornment?: ReactNode;
  endIcon?: ElementType<{ className?: string }>;
  focused?: boolean;
  id?: string;
  invalid?: boolean;
  name?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onValueChange?: (value: string, details: InputChangeEventDetails) => void;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  size?: InputSize;
  startAdornment?: ReactNode;
  startIcon?: ElementType<{ className?: string }>;
  type?: HTMLInputTypeAttribute;
  value?: string;
  variant?: InputVariant;
};
