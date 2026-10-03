import type { ApiResult } from '@ordero/api-types';
import { queryOptions } from '@tanstack/react-query';
import type { Supply } from '@/lib/domain/supplies/types';
import type { PaginatedResponse } from '@/lib/server/types';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { suppliesQueryKeys } from './suppliesQueryKeys';

type SuppliesFetcher = (
  input?: PaginationSearchInput
) => Promise<ApiResult<PaginatedResponse<Supply>>>;

export const suppliesListQueryOptions = (
  fetchSupplies: SuppliesFetcher,
  input?: PaginationSearchInput
) =>
  queryOptions({
    queryKey: suppliesQueryKeys.listPage(input),
    queryFn: async () => {
      const result = await fetchSupplies(input);

      if (!result.ok) {
        throw result.error;
      }

      return result.data;
    },
  });
