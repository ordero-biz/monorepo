import type { SelectRoot } from '@base-ui/react/select';
import type {
  ElementType,
  FocusEventHandler,
  KeyboardEventHandler,
  ReactNode,
} from 'react';

export type SelectSize = 's' | 'm';
export type SelectVariant = 'outlined' | 'filled';

export type SelectOption = {
  disabled?: boolean;
  label: ReactNode;
  value: string;
};

export type SelectProps = {
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  alignItemWithTrigger?: boolean;
  autoComplete?: string;
  defaultOpen?: boolean;
  defaultValue?: string | null;
  disabled?: boolean;
  errorIcon?: ReactNode;
  errorText?: ReactNode;
  helperIcon?: ReactNode;
  helperText?: ReactNode;
  id?: string;
  invalid?: boolean;
  label?: ReactNode;
  name?: string;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  onOpenChange?: (
    open: boolean,
    details: SelectRoot.ChangeEventDetails
  ) => void;
  onValueChange?: (
    value: string | null,
    details: SelectRoot.ChangeEventDetails
  ) => void;
  options: SelectOption[];
  placeholder?: ReactNode;
  readOnly?: boolean;
  required?: boolean;
  size?: SelectSize;
  startAdornment?: ReactNode;
  startIcon?: ElementType<{ className?: string }>;
  value?: string | null;
  variant?: SelectVariant;
};
