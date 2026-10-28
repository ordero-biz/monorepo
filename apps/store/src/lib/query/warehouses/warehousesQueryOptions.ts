import type { ApiResult } from '@ordero/api-types';
import { queryOptions } from '@tanstack/react-query';
import type {
  Warehouse,
  WarehouseStockItem,
} from '@/lib/domain/warehouses/types';
import type { PaginatedResponse } from '@/lib/server/types';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { warehousesQueryKeys } from './warehousesQueryKeys';

type WarehousesFetcher = (
  input?: PaginationSearchInput
) => Promise<ApiResult<PaginatedResponse<Warehouse>>>;

type WarehouseFetcher = (
  warehouseId: string | number
) => Promise<ApiResult<Warehouse>>;

type WarehouseStockFetcher = (
  warehouseId: string | number,
  input?: PaginationSearchInput
) => Promise<ApiResult<PaginatedResponse<WarehouseStockItem>>>;

type WarehouseStockQueryOptionsArgs = {
  warehouseId: string | number;
  fetchWarehouseStock: WarehouseStockFetcher;
  input?: PaginationSearchInput;
};

const unwrapApiResult = async <T>(request: Promise<ApiResult<T>>) => {
  const result = await request;

  if (!result.ok) {
    throw result.error;
  }

  return result.data;
};

export const warehousesListQueryOptions = (
  fetchWarehouses: WarehousesFetcher,
  input?: PaginationSearchInput
) =>
  queryOptions({
    queryKey: warehousesQueryKeys.listPage(input),
    queryFn: () => unwrapApiResult(fetchWarehouses(input)),
  });

export const warehouseQueryOptions = (
  warehouseId: string | number,
  fetchWarehouse: WarehouseFetcher
) =>
  queryOptions({
    queryKey: warehousesQueryKeys.detail(warehouseId),
    queryFn: () => unwrapApiResult(fetchWarehouse(warehouseId)),
  });

export const warehouseStockQueryOptions = ({
  warehouseId,
  fetchWarehouseStock,
  input,
}: WarehouseStockQueryOptionsArgs) =>
  queryOptions({
    queryKey: warehousesQueryKeys.stockPage(warehouseId, input),
    queryFn: () => unwrapApiResult(fetchWarehouseStock(warehouseId, input)),
  });
