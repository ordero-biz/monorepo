import { getEmptyAttributeValueField } from './utils/fields';
import type { CreateAttributeFormValues } from './utils/validations';

export const createAttributeDefaultValues: CreateAttributeFormValues = {
  name: '',
  attributeValues: [getEmptyAttributeValueField(0)],
};
