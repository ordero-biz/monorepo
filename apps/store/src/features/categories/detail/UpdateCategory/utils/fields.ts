import type { Category } from '@/lib/domain/categories';
import type { CategoryFormValues } from '../../../shared/validations';

export const getCategoryDefaultValues = (
  category: Category
): CategoryFormValues => ({
  color: category.color,
  name: category.name,
  parentId: category.parentCategory ? String(category.parentCategory.id) : null,
  sortOrder: String(category.sortOrder),
});
