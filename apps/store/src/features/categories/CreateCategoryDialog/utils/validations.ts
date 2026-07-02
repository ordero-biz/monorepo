import { z } from 'zod';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const categoryNameSchema = z
  .string()
  .trim()
  .min(1, 'Category name is required');

export const categoryParentIdSchema = z.string().nullable();

export const categorySortOrderSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, 'Sort order must be a non-negative number');

export const createCategorySchema = z.object({
  name: categoryNameSchema,
  parentId: categoryParentIdSchema,
  sortOrder: categorySortOrderSchema,
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

export const validateCategoryName = ({ value }: ValidationArgs<string>) => {
  const result = categoryNameSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateCategoryParentId = ({
  value,
}: ValidationArgs<string | null>) => {
  const result = categoryParentIdSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateCategorySortOrder = ({
  value,
}: ValidationArgs<string>) => {
  const result = categorySortOrderSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
