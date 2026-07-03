import type { ApiResult } from '@ordero/api-types';
import { queryOptions } from '@tanstack/react-query';
import type { Product } from '@/lib/domain/products';
import type { PaginatedResponse } from '@/lib/server/types';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { productsQueryKeys } from './productsQueryKeys';

type ProductsFetcher = (
  input?: PaginationSearchInput
) => Promise<ApiResult<PaginatedResponse<Product>>>;

const unwrapApiResult = async <T>(request: Promise<ApiResult<T>>) => {
  const result = await request;

  if (!result.ok) {
    throw result.error;
  }

  return result.data;
};

export const productsListQueryOptions = (
  fetchProducts: ProductsFetcher,
  input?: PaginationSearchInput
) =>
  queryOptions({
    queryKey: productsQueryKeys.listPage(input),
    queryFn: () => unwrapApiResult(fetchProducts(input)),
  });
