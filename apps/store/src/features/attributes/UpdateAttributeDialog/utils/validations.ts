import { z } from 'zod';

export const updateAttributeNameSchema = z
  .string()
  .trim()
  .min(1, 'Attribute name is required');

export const updateAttributeSchema = z.object({
  name: updateAttributeNameSchema,
});

export type UpdateAttributeFormValues = z.infer<typeof updateAttributeSchema>;

export const validateUpdateAttributeName = (value: string) => {
  const result = updateAttributeNameSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
