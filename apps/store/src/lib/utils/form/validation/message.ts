import type { z } from 'zod';

export const getValidationMessage = <TSchema extends z.ZodType>(
  schema: TSchema,
  value: z.input<TSchema>
) => {
  const result = schema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
