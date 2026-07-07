import type { SelectRoot } from '@base-ui/react/select';
import type {
  ElementType,
  FocusEventHandler,
  KeyboardEventHandler,
  ReactNode,
  Ref,
} from 'react';

export type SelectSize = 's' | 'm';
export type SelectVariant = 'outlined' | 'filled';
export type SelectWidth = 'content' | 'full';

export type SelectOption = {
  disabled?: boolean;
  label: ReactNode;
  value: string;
};

type SelectCommonProps = {
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  alignItemWithTrigger?: boolean;
  autoComplete?: string;
  defaultOpen?: boolean;
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
  options: SelectOption[];
  placeholder?: ReactNode;
  readOnly?: boolean;
  ref?: Ref<HTMLButtonElement>;
  required?: boolean;
  size?: SelectSize;
  startAdornment?: ReactNode;
  startIcon?: ElementType<{ className?: string }>;
  variant?: SelectVariant;
  width?: SelectWidth;
};

export type SelectSingleProps = SelectCommonProps & {
  defaultValue?: string | null;
  multiple?: false;
  onValueChange?: (
    value: string | null,
    details: SelectRoot.ChangeEventDetails
  ) => void;
  value?: string | null;
};

export type SelectMultipleProps = SelectCommonProps & {
  defaultValue?: string[];
  multiple: true;
  onValueChange?: (
    value: string[],
    details: SelectRoot.ChangeEventDetails
  ) => void;
  value?: string[];
};

export type SelectProps = SelectSingleProps | SelectMultipleProps;
