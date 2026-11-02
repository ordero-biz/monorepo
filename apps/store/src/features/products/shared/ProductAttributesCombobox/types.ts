import type {
  AttributesAsyncComboboxMultipleProps,
  AttributesAsyncComboboxSingleProps,
} from '@/features/attributes';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';

type ProductAttributesComboboxCommonProps = Pick<
  AttributesAsyncComboboxSingleProps,
  | 'aria-describedby'
  | 'aria-label'
  | 'autoFocus'
  | 'defaultOpen'
  | 'disabledAttributeIds'
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

export type ProductAttributesComboboxProps =
  ProductAttributesComboboxCommonProps &
    (
      | {
          multiple?: false;
          value: AttributeDropdown | null;
          onValueChange: (attribute: AttributeDropdown | null) => void;
        }
      | {
          multiple: true;
          value: AttributeDropdown[];
          onValueChange: (attributes: AttributeDropdown[]) => void;
        }
    );

export type AttributeSingleChangeHandler = NonNullable<
  AttributesAsyncComboboxSingleProps['onValueChange']
>;
export type AttributeMultipleChangeHandler = NonNullable<
  AttributesAsyncComboboxMultipleProps['onValueChange']
>;

export type ReviewProductAttributeProps = {
  attribute: AttributeDropdown;
  onSelect: (attribute: AttributeDropdown) => void;
  onBusyChange: (busy: boolean) => void;
};
