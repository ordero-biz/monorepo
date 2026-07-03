import type { PaginationSearchInput } from '@/lib/utils/url';

export const productsQueryKeys = {
  list: ['products', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...productsQueryKeys.list, input ?? {}] as const,
};
