import { Chip, Combobox } from '@ordero/ui';
import { ATTRIBUTE_VALUE_STATUS } from '@/lib/domain/attributes/constants';
import type { AttributeValue } from '@/lib/domain/attributes/types';
import type { AttributeValuesComboboxProps } from './types';

const getValueId = (value: AttributeValue) => String(value.id);
const getValueLabel = (value: AttributeValue) => value.name;
const renderValueOption = (value: AttributeValue) => (
  <span className="flex min-w-0 items-center gap-[var(--space-1)]">
    <span className="truncate">{value.name}</span>
    {value.status === ATTRIBUTE_VALUE_STATUS.DRAFT ? (
      <Chip size="s" variant="soft">
        Draft
      </Chip>
    ) : null}
  </span>
);

export const AttributeValuesCombobox = (
  props: AttributeValuesComboboxProps
) => (
  <Combobox<AttributeValue>
    {...props}
    getOptionValue={getValueId}
    getOptionLabel={getValueLabel}
    renderOption={renderValueOption}
  />
);
