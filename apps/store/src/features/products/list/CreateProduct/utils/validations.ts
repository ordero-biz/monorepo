import { z } from 'zod';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const productNameSchema = z
  .string()
  .trim()
  .min(1, 'Product name is required');

export const productCategorySchema = z
  .string()
  .min(1, 'Category is required')
  .nullable()
  .refine((value) => value !== null, 'Category is required');

export const validateProductName = ({ value }: ValidationArgs<string>) => {
  const result = productNameSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateProductCategory = ({
  value,
}: ValidationArgs<string | null>) => {
  const result = productCategorySchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
