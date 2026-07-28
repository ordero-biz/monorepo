import type { PaginationSearchInput } from '@/lib/utils/url';

export const productGroupsQueryKeys = {
  list: ['product-groups', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...productGroupsQueryKeys.list, input ?? {}] as const,
};

export const productVariantsQueryKeys = {
  list: ['product-variants', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...productVariantsQueryKeys.list, input ?? {}] as const,
};
