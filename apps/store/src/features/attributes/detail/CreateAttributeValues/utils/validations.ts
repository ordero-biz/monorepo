import { z } from 'zod';
import { ATTRIBUTE_VALUE_STATUS } from '@/lib/domain/attributes/constants';
import { getValidationMessage } from '@/lib/utils/form/validation/message';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const attributeValueNameSchema = z
  .string()
  .trim()
  .min(1, 'Enter an attribute value or remove this empty field');

export const attributeValueStatusSchema = z.enum(
  [ATTRIBUTE_VALUE_STATUS.DRAFT, ATTRIBUTE_VALUE_STATUS.ACTIVE],
  {
    error: 'Attribute value status must be Draft or Active',
  }
);

export const attributeValueSchema = z.object({
  id: z.string(),
  status: attributeValueStatusSchema,
  value: attributeValueNameSchema,
});

export const createAttributeValuesSchema = z.object({
  attributeValues: z
    .array(attributeValueSchema)
    .min(1, 'At least one attribute value is required'),
});

export type AttributeValueFormValue = z.infer<typeof attributeValueSchema>;
export type CreateAttributeValuesFormValues = z.infer<
  typeof createAttributeValuesSchema
>;

export const validateAttributeValueName = ({
  value,
}: ValidationArgs<string>) => {
  return getValidationMessage(attributeValueNameSchema, value);
};

export const validateAttributeValueStatus = ({
  value,
}: ValidationArgs<AttributeValueFormValue['status']>) => {
  return getValidationMessage(attributeValueStatusSchema, value);
};
