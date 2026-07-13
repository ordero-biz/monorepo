import type { ApiResult } from '@ordero/api-types';
import {
  AUTH_TOKEN_COOKIE_NAME,
  parseBackendResponseData,
} from '@ordero/next-api/server';
import { cookies } from 'next/headers';
import type { Warehouse } from '@/lib/domain/warehouses';
import { BACKEND_WAREHOUSE_PATHS } from '@/lib/server/api/path';
import { fetchBackendResponse } from '@/lib/server/fetch';
import type { PaginatedResponse } from '@/lib/server/types';
import { tokenizePath } from '@/lib/utils/tokenizePath';
import {
  getPaginationSearch,
  type PaginationSearchInput,
} from '@/lib/utils/url';

const getServerToken = async () =>
  (await cookies()).get(AUTH_TOKEN_COOKIE_NAME)?.value;

const fetchWarehouseResource = async <T>(
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

export const getServerWarehouses = (input?: PaginationSearchInput) =>
  fetchWarehouseResource<PaginatedResponse<Warehouse>>(
    BACKEND_WAREHOUSE_PATHS.warehouses,
    getPaginationSearch(input)
  );

export const getServerWarehouse = (warehouseId: string | number) =>
  fetchWarehouseResource<Warehouse>(
    tokenizePath(BACKEND_WAREHOUSE_PATHS.warehouse, { id: warehouseId })
  );
