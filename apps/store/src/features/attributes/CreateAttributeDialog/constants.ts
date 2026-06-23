import { getEmptyAttributeValueField } from './utils/fields';
import type { CreateAttributeFormValues } from './utils/validations';

export const INITIAL_ATTRIBUTE_VALUE_FIELD_INDEX = 0;

export const createAttributeDefaultValues: CreateAttributeFormValues = {
  name: '',
  attributeValues: [
    getEmptyAttributeValueField(INITIAL_ATTRIBUTE_VALUE_FIELD_INDEX),
  ],
};
