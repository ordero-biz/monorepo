import type { ApiResult } from '@ordero/api-types';
import { queryOptions } from '@tanstack/react-query';
import type { Warehouse } from '@/lib/domain/warehouses';
import type { PaginatedResponse } from '@/lib/server/types';
import { warehousesQueryKeys } from './warehousesQueryKeys';

type WarehousesFetcher = () => Promise<ApiResult<PaginatedResponse<Warehouse>>>;

const unwrapApiResult = async <T>(request: Promise<ApiResult<T>>) => {
  const result = await request;

  if (!result.ok) {
    throw result.error;
  }

  return result.data;
};

export const warehousesListQueryOptions = (
  fetchWarehouses: WarehousesFetcher
) =>
  queryOptions({
    queryKey: warehousesQueryKeys.list,
    queryFn: () => unwrapApiResult(fetchWarehouses()),
  });
