import type { PaginationSearchInput } from '@/lib/utils/url';

export const warehousesQueryKeys = {
  list: ['warehouses', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...warehousesQueryKeys.list, input ?? {}] as const,
  detail: (warehouseId: string | number) =>
    ['warehouses', 'detail', String(warehouseId)] as const,
};
