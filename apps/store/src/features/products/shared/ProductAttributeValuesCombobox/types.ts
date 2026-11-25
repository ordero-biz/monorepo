import type {
  AttributeValuesComboboxMultipleProps,
  AttributeValuesComboboxSingleProps,
} from '@/features/attributes';
import type { Attribute, AttributeValue } from '@/lib/domain/attributes/types';

type ProductAttributeValuesComboboxCommonProps = Pick<
  AttributeValuesComboboxSingleProps,
  | 'aria-describedby'
  | 'aria-label'
  | 'autoFocus'
  | 'defaultOpen'
  | 'options'
  | 'emptyText'
  | 'endAdornment'
  | 'errorText'
  | 'helperText'
  | 'id'
  | 'invalid'
  | 'label'
  | 'name'
  | 'onBlur'
  | 'placeholder'
  | 'required'
  | 'size'
>;

export type ProductAttributeValuesComboboxProps =
  ProductAttributeValuesComboboxCommonProps & {
    attribute: Pick<Attribute, 'id' | 'name'>;
  } & (
      | {
          multiple?: false;
          value: AttributeValue | null;
          onValueChange: (value: AttributeValue | null) => void;
        }
      | {
          multiple: true;
          value: AttributeValue[];
          onValueChange: (values: AttributeValue[]) => void;
        }
    );

export type AttributeValueSingleChangeHandler = NonNullable<
  AttributeValuesComboboxSingleProps['onValueChange']
>;
export type AttributeValueMultipleChangeHandler = NonNullable<
  AttributeValuesComboboxMultipleProps['onValueChange']
>;

export type ReviewProductAttributeValueProps = {
  attribute: Pick<Attribute, 'id' | 'name'>;
  attributeValue: AttributeValue;
  onSelect: (value: AttributeValue) => void;
  onBusyChange: (busy: boolean) => void;
};
