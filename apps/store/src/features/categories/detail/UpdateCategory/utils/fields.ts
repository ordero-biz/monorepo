import type { UpdateCategoryFormValues } from '@/features/categories/detail/UpdateCategory/utils/validations';
import type { Category } from '@/lib/domain/categories/types';

export const getCategoryDefaultValues = (
  category: Category
): UpdateCategoryFormValues => ({
  name: category.name ?? '',
  parentId: category.parentCategory ? String(category.parentCategory.id) : null,
});
