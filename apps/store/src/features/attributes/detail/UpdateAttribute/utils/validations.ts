import { z } from 'zod';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const updateAttributeNameSchema = z
  .string()
  .trim()
  .min(1, 'Attribute name is required');

export const updateAttributeSchema = z.object({
  name: updateAttributeNameSchema,
});

export type UpdateAttributeFormValues = z.infer<typeof updateAttributeSchema>;

export const validateUpdateAttributeName = ({
  value,
}: ValidationArgs<string>) => {
  const result = updateAttributeNameSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
