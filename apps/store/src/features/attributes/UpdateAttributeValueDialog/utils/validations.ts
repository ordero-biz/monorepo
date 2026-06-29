import { z } from 'zod';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const updateAttributeValueNameSchema = z
  .string()
  .trim()
  .min(1, 'Attribute value name is required');

export const updateAttributeValueSchema = z.object({
  name: updateAttributeValueNameSchema,
  sortOrder: z.number(),
});

export type UpdateAttributeValueFormValues = z.infer<
  typeof updateAttributeValueSchema
>;

export const validateUpdateAttributeValueName = ({ value }: ValidationArgs<string>) => {
  const result = updateAttributeValueNameSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
