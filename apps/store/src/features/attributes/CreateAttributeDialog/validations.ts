import { z } from 'zod';

export const attributeNameSchema = z
  .string()
  .trim()
  .min(1, 'Attribute name is required.')
  .min(4, 'Attribute name must contain at least 4 characters.');

export const attributeNameDefaultValue = '';

export const validateAttributeName = (value: string) => {
  const result = attributeNameSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
