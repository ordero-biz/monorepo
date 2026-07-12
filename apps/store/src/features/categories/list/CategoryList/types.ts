import type { Category } from '@/lib/domain/categories';
import type { PaginationSearchInput } from '@/lib/utils/url';

export type CategoryListProps = {
  paginationInput?: PaginationSearchInput;
};

export type CategoryListHeaderProps = {
  availableCategories: Category[];
};
