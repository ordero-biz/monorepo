import type { PaginationSearchInput } from '@/lib/utils/url';

export const categoriesQueryKeys = {
  list: ['categories', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...categoriesQueryKeys.list, input ?? {}] as const,
  combobox: () => [...categoriesQueryKeys.list, 'category-combobox',] as const
};
