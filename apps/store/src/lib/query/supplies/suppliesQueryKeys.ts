import type { PaginationSearchInput } from '@/lib/utils/url';

export const suppliesQueryKeys = {
  list: ['supplies', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...suppliesQueryKeys.list, input ?? {}] as const,
};
