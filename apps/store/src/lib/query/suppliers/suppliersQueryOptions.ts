import type { ApiResult } from '@ordero/api-types';
import { queryOptions } from '@tanstack/react-query';
import type { Supplier } from '@/lib/domain/suppliers';
import type { PaginatedResponse } from '@/lib/server/types';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { suppliersQueryKeys } from './suppliersQueryKeys';

type SuppliersFetcher = (
  input?: PaginationSearchInput
) => Promise<ApiResult<PaginatedResponse<Supplier>>>;

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
