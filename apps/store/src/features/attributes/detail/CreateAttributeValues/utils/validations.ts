import { z } from 'zod';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const attributeValueNameSchema = z
  .string()
  .trim()
  .min(1, 'Attribute value is required');

export const attributeValueSchema = z.object({
  id: z.string(),
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

export const validateAttributeValues = ({
  value,
}: ValidationArgs<AttributeValueFormValue[]>) => {
  const hasAttributeValue = value.some(
    (attributeValue) =>
      attributeValueNameSchema.safeParse(attributeValue.value).success
  );

  return hasAttributeValue
    ? undefined
    : 'At least one attribute value is required';
};
