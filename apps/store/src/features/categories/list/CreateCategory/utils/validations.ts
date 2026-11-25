import { z } from 'zod';
import {
  categoryNameSchema,
  categoryParentSchema,
  categoryStatusSchema,
} from '@/features/categories/shared/validations';

export const createCategoryFormSchema = z.object({
  name: categoryNameSchema,
  parentCategory: categoryParentSchema,
  status: categoryStatusSchema,
});

export type CreateCategoryFormValues = z.infer<typeof createCategoryFormSchema>;
