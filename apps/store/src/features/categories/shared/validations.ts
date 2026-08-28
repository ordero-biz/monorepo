import { z } from 'zod';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import { getValidationMessage } from '@/lib/utils/form/validation/message';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const categoryNameSchema = z
  .string()
  .trim()
  .min(1, 'Category name is required');

export const categoryParentIdSchema = z.string().nullable();

export const categoryStatusSchema = z.enum(
  [CATEGORY_STATUS.DRAFT, CATEGORY_STATUS.ACTIVE],
  {
    error: 'Category status is required',
  }
);

export const validateCategoryName = ({ value }: ValidationArgs<string>) => {
  return getValidationMessage(categoryNameSchema, value);
};

export const validateCategoryParentId = ({
  value,
}: ValidationArgs<string | null>) => {
  return getValidationMessage(categoryParentIdSchema, value);
};

export const validateCategoryStatus = ({
  value,
}: ValidationArgs<z.infer<typeof categoryStatusSchema>>) => {
  return getValidationMessage(categoryStatusSchema, value);
};
