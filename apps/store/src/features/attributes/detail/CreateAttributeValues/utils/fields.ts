import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';

export const getAttributeValueFieldId = (index: number) =>
  `attribute-value-${index}`;

export const getEmptyAttributeValueField = (index: number) => ({
  id: getAttributeValueFieldId(index),
  status: ATTRIBUTE_STATUS.DRAFT,
  value: '',
});
