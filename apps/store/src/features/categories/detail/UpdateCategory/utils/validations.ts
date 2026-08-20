import { z } from 'zod';
import {categoryNameSchema, categoryParentIdSchema} from "@/features/categories/shared/validations";

export const updateCategoryFormSchema = z.object({
  name: categoryNameSchema,
  parentId: categoryParentIdSchema,
});

export type UpdateCategoryFormValues = z.infer<typeof updateCategoryFormSchema>;