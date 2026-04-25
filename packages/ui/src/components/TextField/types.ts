import type { InputChangeEventDetails } from '@base-ui/react/input';
import type {
  ElementType,
  FocusEventHandler,
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
  KeyboardEventHandler,
  ReactNode,
} from 'react';

export type TextFieldSize = 's' | 'm';
export type TextFieldVariant = 'outlined' | 'filled';

export type TextFieldProps = {
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  autoFocus?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  endAdornment?: ReactNode;
  endIcon?: ElementType<{ className?: string }>;
  errorIcon?: ReactNode;
  errorText?: ReactNode;
  helperIcon?: ReactNode;
  helperText?: ReactNode;
  id?: string;
  invalid?: boolean;
  label?: ReactNode;
  name?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onValueChange?: (value: string, details: InputChangeEventDetails) => void;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  size?: TextFieldSize;
  startAdornment?: ReactNode;
  startIcon?: ElementType<{ className?: string }>;
  type?: HTMLInputTypeAttribute;
  value?: string;
  variant?: TextFieldVariant;
};
