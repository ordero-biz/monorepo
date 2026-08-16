import { z } from 'zod';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';
import type { CategoryFormValues } from '../../../shared/validations';

export const categoryStatusSchema = z.enum(['draft', 'active'], {
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
