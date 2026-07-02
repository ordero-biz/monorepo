import type { PaginationSearchInput } from '@/lib/utils/url';

export const categoriesQueryKeys = {
  list: ['categories', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...categoriesQueryKeys.list, input ?? {}] as const,
};
