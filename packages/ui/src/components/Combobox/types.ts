import type { ComboboxRoot } from '@base-ui/react/combobox';
import type {
  ElementType,
  FocusEventHandler,
  HTMLInputAutoCompleteAttribute,
  KeyboardEventHandler,
  ReactNode,
  Ref,
  UIEventHandler,
} from 'react';

export type ComboboxSize = 's' | 'm';
export type ComboboxVariant = 'outlined' | 'filled';

export type ComboboxOption = {
  data?: unknown;
  disabled?: boolean;
  displayValue: string;
  label?: ReactNode;
  value: string;
};

export type ComboboxChangeEventDetails = ComboboxRoot.ChangeEventDetails;

type ComboboxCommonProps = {
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  autoFocus?: boolean;
  defaultInputValue?: string;
  defaultOpen?: boolean;
  disabled?: boolean;
  emptyText?: ReactNode;
  endAdornment?: ReactNode;
  endIcon?: ElementType<{ className?: string }>;
  errorIcon?: ReactNode;
  errorText?: ReactNode;
  helperIcon?: ReactNode;
  helperText?: ReactNode;
  id?: string;
  inputValue?: string;
  invalid?: boolean;
  label?: ReactNode;
  listErrorText?: ReactNode;
  loading?: boolean;
  loadingMore?: boolean;
  loadingText?: ReactNode;
  name?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onInputValueChange?: (
    value: string,
    details: ComboboxChangeEventDetails
  ) => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onListScroll?: UIEventHandler<HTMLDivElement>;
  onOpenChange?: (open: boolean, details: ComboboxChangeEventDetails) => void;
  open?: boolean;
  options: ComboboxOption[];
  placeholder?: string;
  readOnly?: boolean;
  ref?: Ref<HTMLInputElement>;
  required?: boolean;
  size?: ComboboxSize;
  startAdornment?: ReactNode;
  startIcon?: ElementType<{ className?: string }>;
  variant?: ComboboxVariant;
};

export type ComboboxSingleProps = ComboboxCommonProps & {
  defaultValue?: string | null;
  multiple?: false;
  onValueChange?: (
    value: string | null,
    details: ComboboxChangeEventDetails
  ) => void;
  onOptionSelect?: (
    option: ComboboxOption | null
  ) => void;
  value?: string | null;
};

export type ComboboxMultipleProps = ComboboxCommonProps & {
  defaultValue?: string[];
  multiple: true;
  onValueChange?: (
    value: string[],
    details: ComboboxChangeEventDetails
  ) => void;
  value?: string[];
};

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;
