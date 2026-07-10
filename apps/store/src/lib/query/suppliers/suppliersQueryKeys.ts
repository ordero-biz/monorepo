import type { PaginationSearchInput } from '@/lib/utils/url';

export const suppliersQueryKeys = {
  list: ['suppliers', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...suppliersQueryKeys.list, input ?? {}] as const,
  detail: (supplierId: string | number) =>
    ['suppliers', 'detail', String(supplierId)] as const,
};
