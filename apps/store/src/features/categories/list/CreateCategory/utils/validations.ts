import { z } from 'zod';
import {categoryNameSchema, categoryParentIdSchema, categoryStatusSchema} from "@/features/categories/shared/validations";

export const createCategoryFormSchema = z.object({
  name: categoryNameSchema,
  parentId: categoryParentIdSchema,
  status: categoryStatusSchema,
});

export type CreateCategoryFormValues = z.infer<typeof createCategoryFormSchema>;

