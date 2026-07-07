import type {
  ChangeEvent,
  FocusEventHandler,
  KeyboardEventHandler,
  ReactNode,
  Ref,
} from 'react';

export type TextareaResize = 'none' | 'vertical';
export type TextareaVariant = 'outlined' | 'filled';

export type TextareaChangeEventDetails = {
  event: ChangeEvent<HTMLTextAreaElement>;
};

export type TextareaProps = {
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  errorIcon?: ReactNode;
  errorText?: ReactNode;
  focused?: boolean;
  helperIcon?: ReactNode;
  helperText?: ReactNode;
  id?: string;
  invalid?: boolean;
  label?: ReactNode;
  maxLength?: number;
  minLength?: number;
  name?: string;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  onFocus?: FocusEventHandler<HTMLTextAreaElement>;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
  onValueChange?: (value: string, details: TextareaChangeEventDetails) => void;
  placeholder?: string;
  readOnly?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
  required?: boolean;
  resize?: TextareaResize;
  rows?: number;
  spellCheck?: boolean;
  value?: string;
  variant?: TextareaVariant;
};
