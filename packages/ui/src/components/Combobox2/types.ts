import type { ReactNode } from 'react';
import type {
  ComboboxChangeEventDetails,
  ComboboxSingleProps,
} from '../Combobox/types';

type Combobox2CommonProps<TOption extends object> = Omit<
  ComboboxSingleProps,
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
  | 'onOptionSelect'
  | 'options'
  | 'multiple'
> & {
  options: TOption[];
  /** Stable ID used for equality and native form serialization. */
  getOptionValue: (option: TOption) => string;
  /** Plain text used for input display, filtering, and accessible names. */
  getOptionLabel: (option: TOption) => string;
  /** Rich content shared by list options and selected multi-select chips. */
  renderOption?: (option: TOption) => ReactNode;
  isOptionDisabled?: (option: TOption) => boolean;
};

export type Combobox2SingleProps<TOption extends object> =
  Combobox2CommonProps<TOption> & {
    multiple?: false;
    value?: TOption | null;
    defaultValue?: TOption | null;
    onValueChange?: (
      value: TOption | null,
      details: ComboboxChangeEventDetails
    ) => void;
  };

export type Combobox2MultipleProps<TOption extends object> =
  Combobox2CommonProps<TOption> & {
    multiple: true;
    value?: TOption[];
    defaultValue?: TOption[];
    onValueChange?: (
      value: TOption[],
      details: ComboboxChangeEventDetails
    ) => void;
  };

export type Combobox2Props<TOption extends object> =
  | Combobox2SingleProps<TOption>
  | Combobox2MultipleProps<TOption>;
