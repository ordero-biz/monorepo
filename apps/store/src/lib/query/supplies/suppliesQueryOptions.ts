import type { ApiResult } from '@ordero/api-types';
import { queryOptions } from '@tanstack/react-query';
import type { Supply } from '@/lib/domain/supplies';
import type { PaginatedResponse } from '@/lib/server/types';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { suppliesQueryKeys } from './suppliesQueryKeys';

type SuppliesFetcher = (
  input?: PaginationSearchInput
) => Promise<ApiResult<PaginatedResponse<Supply>>>;

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
