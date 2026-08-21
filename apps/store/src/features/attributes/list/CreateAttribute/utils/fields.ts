import { ATTRIBUTE_VALUE_STATUS } from '@/lib/domain/attributes/constants';

export const getAttributeValueFieldId = (index: number) =>
  `attribute-value-${index}`;

export const getEmptyAttributeValueField = (index: number) => {
  const fieldId = getAttributeValueFieldId(index);

  return {
    id: fieldId,
    status: ATTRIBUTE_VALUE_STATUS.DRAFT,
    value: '',
  };
};
