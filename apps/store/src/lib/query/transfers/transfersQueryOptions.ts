import type { ApiResult } from '@ordero/api-types';
import { queryOptions } from '@tanstack/react-query';
import type { Transfer, TransferDetails } from '@/lib/domain/transfers/types';
import type { PaginatedResponse } from '@/lib/server/types';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { transfersQueryKeys } from './transfersQueryKeys';

type TransfersFetcher = (
  input?: PaginationSearchInput
) => Promise<ApiResult<PaginatedResponse<Transfer>>>;

type TransferFetcher = (
  transferId: string | number
) => Promise<ApiResult<TransferDetails>>;

const unwrapApiResult = async <T>(request: Promise<ApiResult<T>>) => {
  const result = await request;

  if (!result.ok) {
    throw result.error;
  }

  return result.data;
};

export const transfersListQueryOptions = (
  fetchTransfers: TransfersFetcher,
  input?: PaginationSearchInput
) =>
  queryOptions({
    queryKey: transfersQueryKeys.listPage(input),
    queryFn: () => unwrapApiResult(fetchTransfers(input)),
  });

export const transferQueryOptions = (
  transferId: string | number,
  fetchTransfer: TransferFetcher
) =>
  queryOptions({
    queryKey: transfersQueryKeys.detail(transferId),
    queryFn: () => unwrapApiResult(fetchTransfer(transferId)),
    refetchOnWindowFocus: 'always',
  });
