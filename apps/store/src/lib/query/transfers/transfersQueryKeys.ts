import type { PaginationSearchInput } from '@/lib/utils/url';

export const transfersQueryKeys = {
  list: ['transfers', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...transfersQueryKeys.list, input ?? {}] as const,
};
