import type { PaginationSearchInput } from '@/lib/utils/url';

export const transfersQueryKeys = {
  list: ['transfers', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...transfersQueryKeys.list, input ?? {}] as const,
  detail: (transferId: string | number) =>
    ['transfers', 'detail', String(transferId)] as const,
};
