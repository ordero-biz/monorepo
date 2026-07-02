import type { ApiResult } from '@ordero/api-types';
import {
  AUTH_TOKEN_COOKIE_NAME,
  parseBackendResponseData,
} from '@ordero/next-api/server';
import { cookies } from 'next/headers';
import type { Category } from '@/lib/domain/categories';
import { BACKEND_CATEGORY_PATHS } from '@/lib/server/api/path';
import { fetchBackendResponse } from '@/lib/server/fetch';
import type { PaginatedResponse } from '@/lib/server/types';
import {
  getPaginationSearch,
  type PaginationSearchInput,
} from '@/lib/utils/url';

const getServerToken = async () =>
  (await cookies()).get(AUTH_TOKEN_COOKIE_NAME)?.value;

const fetchCategoryResource = async <T>(
  path: string,
  search?: string
): Promise<ApiResult<T>> => {
  const token = await getServerToken();

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

export const getServerCategories = (input?: PaginationSearchInput) =>
  fetchCategoryResource<PaginatedResponse<Category>>(
    BACKEND_CATEGORY_PATHS.categories,
    getPaginationSearch(input)
  );
