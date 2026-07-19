import { z } from 'zod';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const categoryNameSchema = z
  .string()
  .trim()
  .min(1, 'Category name is required');

export const categoryParentIdSchema = z.string().nullable();

export const categoryColorSchema = z
  .string()
  .trim()
  .min(1, 'Category color is required');

export const categorySortOrderSchema = z
  .string()
  .trim()
  .regex(/^-?\d+$/, 'Sort order must be a whole number');

export const categoryFormSchema = z.object({
  color: categoryColorSchema,
  name: categoryNameSchema,
  parentId: categoryParentIdSchema,
  sortOrder: categorySortOrderSchema,
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

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

export const validateCategoryColor = ({ value }: ValidationArgs<string>) => {
  const result = categoryColorSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateCategorySortOrder = ({
  value,
}: ValidationArgs<string>) => {
  const result = categorySortOrderSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
