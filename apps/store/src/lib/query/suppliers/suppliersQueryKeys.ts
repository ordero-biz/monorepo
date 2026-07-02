import type { PaginationSearchInput } from '@/lib/utils/url';

export const suppliersQueryKeys = {
  list: ['suppliers', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...suppliersQueryKeys.list, input ?? {}] as const,
};
