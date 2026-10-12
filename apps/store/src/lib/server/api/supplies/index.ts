import type { ApiResult } from '@ordero/api-types';
import {
  AUTH_TOKEN_COOKIE_NAME,
  parseBackendResponseData,
} from '@ordero/next-api/server';
import { cookies } from 'next/headers';
import type { Supply } from '@/lib/domain/supplies/types';
import { BACKEND_SUPPLY_PATHS } from '@/lib/server/api/path';
import { fetchBackendResponse } from '@/lib/server/fetch';
import type { PaginatedResponse } from '@/lib/server/types';
import {
  getPaginationSearch,
  type PaginationSearchInput,
} from '@/lib/utils/url';

export const getServerSupplies = async (
  input?: PaginationSearchInput
): Promise<ApiResult<PaginatedResponse<Supply>>> => {
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
    path: BACKEND_SUPPLY_PATHS.supplies,
    search: getPaginationSearch(input),
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
    data: await parseBackendResponseData<PaginatedResponse<Supply>>(
      result.data
    ),
  };
};
