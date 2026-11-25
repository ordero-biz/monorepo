import { z } from 'zod';
import {
  categoryNameSchema,
  categoryParentSchema,
} from '@/features/categories/shared/validations';

export const updateCategoryFormSchema = z.object({
  name: categoryNameSchema,
  parentCategory: categoryParentSchema,
});

export type UpdateCategoryFormValues = z.infer<typeof updateCategoryFormSchema>;
