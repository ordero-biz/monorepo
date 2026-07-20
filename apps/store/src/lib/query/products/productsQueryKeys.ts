import type { PaginationSearchInput } from '@/lib/utils/url';

export const productsQueryKeys = {
  list: ['products', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...productsQueryKeys.list, input ?? {}] as const,
  variantsList: ['products', 'variants', 'list'] as const,
  variantsListPage: (input?: PaginationSearchInput) =>
    [...productsQueryKeys.variantsList, input ?? {}] as const,
};
