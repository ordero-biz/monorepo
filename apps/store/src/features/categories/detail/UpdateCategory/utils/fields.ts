import type { UpdateCategoryFormValues } from '@/features/categories/detail/UpdateCategory/utils/validations';
import type { Category } from '@/lib/domain/categories/types';

export const getCategoryDefaultValues = (
  category: Category
): UpdateCategoryFormValues => ({
  name: category.name ?? '',
  parentCategory: category.parentCategory
    ? {
        id: category.parentCategory.id,
        name: category.parentCategory.name,
        status: category.parentCategory.status,
      }
    : null,
});
