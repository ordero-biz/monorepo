import type { ApiResult } from '@ordero/api-types';
import { queryOptions } from '@tanstack/react-query';
import type { Supplier } from '@/lib/domain/suppliers/types';
import type { PaginatedResponse } from '@/lib/server/types';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { suppliersQueryKeys } from './suppliersQueryKeys';

type SuppliersFetcher = (
  input?: PaginationSearchInput
) => Promise<ApiResult<PaginatedResponse<Supplier>>>;

type SupplierFetcher = (
  supplierId: string | number
) => Promise<ApiResult<Supplier>>;

const unwrapApiResult = async <T>(request: Promise<ApiResult<T>>) => {
  const result = await request;

  if (!result.ok) {
    throw result.error;
  }

  return result.data;
};

export const suppliersListQueryOptions = (
  fetchSuppliers: SuppliersFetcher,
  input?: PaginationSearchInput
) =>
  queryOptions({
    queryKey: suppliersQueryKeys.listPage(input),
    queryFn: () => unwrapApiResult(fetchSuppliers(input)),
  });

export const supplierQueryOptions = (
  supplierId: string | number,
  fetchSupplier: SupplierFetcher
) =>
  queryOptions({
    queryKey: suppliersQueryKeys.detail(supplierId),
    queryFn: () => unwrapApiResult(fetchSupplier(supplierId)),
  });
