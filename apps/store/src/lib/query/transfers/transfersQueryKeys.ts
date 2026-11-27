import type { PaginationSearchInput } from '@/lib/utils/url';

export const transfersQueryKeys = {
  list: ['transfers', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...transfersQueryKeys.list, input ?? {}] as const,
  // Warehouse lists share transfer-write invalidation with the global list.
  warehouseList: (warehouseId: string | number) =>
    [...transfersQueryKeys.list, 'warehouse', String(warehouseId)] as const,
  warehouseListPage: (
    warehouseId: string | number,
    input?: PaginationSearchInput
  ) => [...transfersQueryKeys.warehouseList(warehouseId), input ?? {}] as const,
  detail: (transferId: string | number) =>
    ['transfers', 'detail', String(transferId)] as const,
};
