import type { PaginationSearchInput } from '@/lib/utils/url';

export const suppliesQueryKeys = {
  list: ['supplies', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...suppliesQueryKeys.list, input ?? {}] as const,
  // Warehouse lists share supply-write invalidation with the global list.
  warehouseList: (warehouseId: string | number) =>
    [...suppliesQueryKeys.list, 'warehouse', String(warehouseId)] as const,
  warehouseListPage: (
    warehouseId: string | number,
    input?: PaginationSearchInput
  ) => [...suppliesQueryKeys.warehouseList(warehouseId), input ?? {}] as const,
  detail: (supplyId: string | number) =>
    ['supplies', 'detail', String(supplyId)] as const,
};
