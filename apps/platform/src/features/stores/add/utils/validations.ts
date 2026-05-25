import { z } from 'zod';

const requiredStoreFieldMessage = 'This field is required.';

export const storeNameSchema = z
  .string()
  .trim()
  .min(1, requiredStoreFieldMessage);

export const storeSubDomainSchema = z
  .string()
  .trim()
  .min(1, requiredStoreFieldMessage);

export const addStoreSchema = z.object({
  name: storeNameSchema,
  subDomain: storeSubDomainSchema,
});

export type AddStoreFormValues = z.infer<typeof addStoreSchema>;

export const validateStoreName = (value: string) => {
  const result = storeNameSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateStoreSubDomain = (value: string) => {
  const result = storeSubDomainSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
