import type {
  AsyncComboboxMultipleProps,
  AsyncComboboxSingleProps,
} from '@/lib/components/AsyncCombobox';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';

type AttributeOwnedProps =
  | 'emptyText'
  | 'isOptionDisabled'
  | 'loadErrorText'
  | 'loadingText'
  | 'loadOptions'
  | 'getOptionLabel'
  | 'getOptionValue'
  | 'renderOption'
  | 'pageSize'
  | 'queryKey'
  | 'staticOptions';

type AttributeOptionsProps = {
  disabledAttributeIds?: readonly AttributeDropdown['id'][];
};

export type AttributesAsyncComboboxSingleProps = Omit<
  AsyncComboboxSingleProps<AttributeDropdown>,
  AttributeOwnedProps
> &
  AttributeOptionsProps;

export type AttributesAsyncComboboxMultipleProps = Omit<
  AsyncComboboxMultipleProps<AttributeDropdown>,
  AttributeOwnedProps
> &
  AttributeOptionsProps;

export type AttributesAsyncComboboxProps =
  | AttributesAsyncComboboxSingleProps
  | AttributesAsyncComboboxMultipleProps;
