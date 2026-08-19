import type { Category } from '@/lib/domain/categories/types';
import type { CategoryFormValues } from '../../../shared/validations';

export const getCategoryDefaultValues = (
  category: Category
): CategoryFormValues => ({
  name: category.name ?? '',
  parentId: category.parentCategory ? String(category.parentCategory.id) : null,
});
