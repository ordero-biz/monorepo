import type { Category } from '@/lib/domain/categories/types';
import {UpdateCategoryFormValues} from "@/features/categories/detail/UpdateCategory/utils/validations";

export const getCategoryDefaultValues = (
  category: Category
): UpdateCategoryFormValues => ({
  name: category.name ?? '',
  parentId: category.parentCategory ? String(category.parentCategory.id) : null,
});
