import type { ApiResult } from '@ordero/api-types';
import {
  AUTH_TOKEN_COOKIE_NAME,
  parseBackendResponseData,
} from '@ordero/next-api/server';
import { cookies } from 'next/headers';
import type { Transfer } from '@/lib/domain/transfers/types';
import { BACKEND_TRANSFER_PATHS } from '@/lib/server/api/path';
import { fetchBackendResponse } from '@/lib/server/fetch';
import type { PaginatedResponse } from '@/lib/server/types';
import {
  getPaginationSearch,
  type PaginationSearchInput,
} from '@/lib/utils/url';

const fetchTransferResource = async <T>(
  path: string,
  search?: string
): Promise<ApiResult<T>> => {
  const token = (await cookies()).get(AUTH_TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    return {
      ok: false,
      error: {
        status: 401,
        message: 'Authentication required.',
      },
    };
  }

  const result = await fetchBackendResponse({
    path,
    search,
    token,
    init: {
      method: 'GET',
    },
  });

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: await parseBackendResponseData<T>(result.data),
  };
};

export const getServerTransfers = (input?: PaginationSearchInput) =>
  fetchTransferResource<PaginatedResponse<Transfer>>(
    BACKEND_TRANSFER_PATHS.warehouseTransfers,
    getPaginationSearch(input)
  );
