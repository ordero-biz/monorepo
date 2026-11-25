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

export type ComboboxChangeEventDetails = ComboboxRoot.ChangeEventDetails;

type ComboboxCommonProps<TOption extends object> = {
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
  options: TOption[];
  placeholder?: string;
  readOnly?: boolean;
  ref?: Ref<HTMLInputElement>;
  required?: boolean;
  size?: ComboboxSize;
  startAdornment?: ReactNode;
  startIcon?: ElementType<{ className?: string }>;
  variant?: ComboboxVariant;
  /** Stable ID used for equality and native form serialization. */
  getOptionValue: (option: TOption) => string;
  /** Plain text used for input display, filtering, and accessible names. */
  getOptionLabel: (option: TOption) => string;
  /** Rich content shared by list options and selected multi-select chips. */
  renderOption?: (option: TOption) => ReactNode;
  isOptionDisabled?: (option: TOption) => boolean;
};

export type ComboboxSingleProps<TOption extends object> =
  ComboboxCommonProps<TOption> & {
    multiple?: false;
    value?: TOption | null;
    defaultValue?: TOption | null;
    onValueChange?: (
      value: TOption | null,
      details: ComboboxChangeEventDetails
    ) => void;
  };

export type ComboboxMultipleProps<TOption extends object> =
  ComboboxCommonProps<TOption> & {
    multiple: true;
    value?: TOption[];
    defaultValue?: TOption[];
    onValueChange?: (
      value: TOption[],
      details: ComboboxChangeEventDetails
    ) => void;
  };

export type ComboboxProps<TOption extends object> =
  | ComboboxSingleProps<TOption>
  | ComboboxMultipleProps<TOption>;
