import { getAttributesDropdown } from '@/lib/client/api/attributes';
import {
  AsyncCombobox,
  type AsyncComboboxLoadOptionsResult,
} from '@/lib/components/AsyncCombobox';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import type { AttributesAsyncComboboxProps } from './types';

const getAttributeValue = (attribute: AttributeDropdown) =>
  String(attribute.id);
const getAttributeLabel = (attribute: AttributeDropdown) => attribute.name;

const loadAttributeOptions = async (): Promise<
  AsyncComboboxLoadOptionsResult<AttributeDropdown>
> => {
  const result = await getAttributesDropdown();

  if (!result.ok) {
    throw result.error;
  }

  return { options: result.data };
};

export const AttributesAsyncCombobox = ({
  invalid,
  onAttributeSelected,
  onBlur,
  selectedAttributes,
}: AttributesAsyncComboboxProps) => (
  <AsyncCombobox<AttributeDropdown>
    autoFocus
    defaultOpen
    emptyText="No attributes found"
    getOptionLabel={getAttributeLabel}
    getOptionValue={getAttributeValue}
    invalid={invalid}
    isOptionDisabled={(attribute) =>
      selectedAttributes.some((selected) => selected.id === attribute.id)
    }
    label="Attribute"
    loadErrorText="We couldn't load attributes right now."
    loadingText="Loading attributes..."
    loadOptions={loadAttributeOptions}
    name="attributes"
    onBlur={onBlur}
    onValueChange={(attribute) => {
      if (attribute) {
        onAttributeSelected(attribute);
      }
    }}
    pageSize={100}
    placeholder="Select attribute"
    queryKey={[...attributesQueryKeys.attributeDropdown(), 'combobox']}
    size="s"
    value={null}
  />
);
