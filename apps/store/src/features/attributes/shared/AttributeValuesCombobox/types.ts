import type { ComboboxMultipleProps, ComboboxSingleProps } from '@ordero/ui';
import type { AttributeValue } from '@/lib/domain/attributes/types';

type OwnedProps = 'getOptionValue' | 'getOptionLabel' | 'renderOption';
export type AttributeValuesComboboxSingleProps = Omit<
  ComboboxSingleProps<AttributeValue>,
  OwnedProps
>;
export type AttributeValuesComboboxMultipleProps = Omit<
  ComboboxMultipleProps<AttributeValue>,
  OwnedProps
>;
export type AttributeValuesComboboxProps =
  | AttributeValuesComboboxSingleProps
  | AttributeValuesComboboxMultipleProps;
