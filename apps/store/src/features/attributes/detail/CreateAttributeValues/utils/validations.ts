import { z } from 'zod';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const attributeValueNameSchema = z
  .string()
  .trim()
  .min(1, 'Enter an attribute value or remove this empty field');

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

export const validateAttributeValueName = ({
  value,
}: ValidationArgs<string>) => {
  const result = attributeValueNameSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
