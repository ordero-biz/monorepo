import type { PaginationSearchInput } from '@/lib/utils/url';

export const warehousesQueryKeys = {
  list: ['warehouses', 'list'] as const,
  listPage: (input?: PaginationSearchInput) =>
    [...warehousesQueryKeys.list, input ?? {}] as const,
  options: () => [...warehousesQueryKeys.list, 'options'] as const,
  detail: (warehouseId: string | number) =>
    ['warehouses', 'detail', String(warehouseId)] as const,
  allStock: ['warehouses', 'stock'] as const,
  stock: (warehouseId: string | number) =>
    [...warehousesQueryKeys.allStock, String(warehouseId)] as const,
  stockPage: (warehouseId: string | number, input?: PaginationSearchInput) =>
    [...warehousesQueryKeys.stock(warehouseId), input ?? {}] as const,
};
