import { getEmptyAttributeValueField } from './utils/fields';
import type { CreateAttributeValuesFormValues } from './utils/validations';

export const INITIAL_ATTRIBUTE_VALUE_FIELD_INDEX = 0;

export const createAttributeValuesDefaultValues: CreateAttributeValuesFormValues =
  {
    attributeValues: [
      getEmptyAttributeValueField(INITIAL_ATTRIBUTE_VALUE_FIELD_INDEX),
    ],
  };
