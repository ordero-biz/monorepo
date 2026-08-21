import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
import { getEmptyAttributeValueField } from './utils/fields';
import type { CreateAttributeFormValues } from './utils/validations';

export const INITIAL_ATTRIBUTE_VALUE_FIELD_INDEX = 0;

export const createAttributeDefaultValues: CreateAttributeFormValues = {
  name: '',
  status: ATTRIBUTE_STATUS.DRAFT,
  attributeValues: [
    getEmptyAttributeValueField(INITIAL_ATTRIBUTE_VALUE_FIELD_INDEX),
  ],
};

export const ATTRIBUTE_VALUE_STATUS_OPTIONS = [
  {
    label: 'Draft',
    value: ATTRIBUTE_STATUS.DRAFT,
  },
  {
    label: 'Active',
    value: ATTRIBUTE_STATUS.ACTIVE,
  },
];
