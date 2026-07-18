import { z } from 'zod';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const attributeNameSchema = z
  .string()
  .trim()
  .min(1, 'Attribute name is required');

export const attributeValueNameSchema = z
  .string()
  .trim()
  .min(1, 'Enter an attribute value or remove this empty field');

export const attributeValueSchema = z.object({
  id: z.string(),
  value: z.string(),
});

export const createAttributeSchema = z.object({
  name: attributeNameSchema,
  attributeValues: z.array(attributeValueSchema),
});

export type AttributeValueFormValue = z.infer<typeof attributeValueSchema>;
export type CreateAttributeFormValues = z.infer<typeof createAttributeSchema>;

export const validateAttributeName = ({ value }: ValidationArgs<string>) => {
  const result = attributeNameSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateAttributeValueName = ({
  value,
}: ValidationArgs<string>) => {
  const result = attributeValueNameSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
