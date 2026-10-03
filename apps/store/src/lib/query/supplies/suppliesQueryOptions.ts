import type { ApiResult } from '@ordero/api-types';
import { queryOptions } from '@tanstack/react-query';
import type { Supply, SupplyDetails } from '@/lib/domain/supplies/types';
import type { PaginatedResponse } from '@/lib/server/types';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { suppliesQueryKeys } from './suppliesQueryKeys';

type SuppliesFetcher = (
  input?: PaginationSearchInput
) => Promise<ApiResult<PaginatedResponse<Supply>>>;

type SupplyFetcher = (
  supplyId: string | number
) => Promise<ApiResult<SupplyDetails>>;

const unwrapApiResult = async <T>(request: Promise<ApiResult<T>>) => {
  const result = await request;

  if (!result.ok) {
    throw result.error;
  }

  return result.data;
};

export const suppliesListQueryOptions = (
  fetchSupplies: SuppliesFetcher,
  input?: PaginationSearchInput
) =>
  queryOptions({
    queryKey: suppliesQueryKeys.listPage(input),
    queryFn: () => unwrapApiResult(fetchSupplies(input)),
  });

export const supplyQueryOptions = (
  supplyId: string | number,
  fetchSupply: SupplyFetcher
) =>
  queryOptions({
    queryKey: suppliesQueryKeys.detail(supplyId),
    queryFn: () => unwrapApiResult(fetchSupply(supplyId)),
  });
