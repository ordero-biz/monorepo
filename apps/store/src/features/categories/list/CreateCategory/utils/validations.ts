import { z } from 'zod';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';
import type { CategoryFormValues } from '../../../shared/validations';

export const categoryStatusSchema = z.enum([CATEGORY_STATUS.DRAFT, CATEGORY_STATUS.ACTIVE], {
  error: 'Category status is required',
});

export type CreateCategoryFormValues = CategoryFormValues & {
  status: z.infer<typeof categoryStatusSchema>;
};

export const validateCategoryStatus = ({
  value,
}: ValidationArgs<z.infer<typeof categoryStatusSchema>>) => {
  const result = categoryStatusSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
export {
  categoryNameSchema,
  categoryParentIdSchema,
  validateCategoryName,
  validateCategoryParentId,
} from '../../../shared/validations';
