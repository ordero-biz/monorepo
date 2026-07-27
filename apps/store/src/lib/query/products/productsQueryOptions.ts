import type { ApiResult } from '@ordero/api-types';
import { queryOptions } from '@tanstack/react-query';
import type { ProductGroup, ProductVariant } from '@/lib/domain/products';
import type { PaginatedResponse } from '@/lib/server/types';
import type { PaginationSearchInput } from '@/lib/utils/url';
import {
  productGroupsQueryKeys,
  productVariantsQueryKeys,
} from './productsQueryKeys';

type ProductGroupsFetcher = (
  input?: PaginationSearchInput
) => Promise<ApiResult<PaginatedResponse<ProductGroup>>>;

type ProductVariantsFetcher = (
  input?: PaginationSearchInput
) => Promise<ApiResult<PaginatedResponse<ProductVariant>>>;

const unwrapApiResult = async <T>(request: Promise<ApiResult<T>>) => {
  const result = await request;

  if (!result.ok) {
    throw result.error;
  }

  return result.data;
};

export const productGroupsListQueryOptions = (
  fetchProductGroups: ProductGroupsFetcher,
  input?: PaginationSearchInput
) =>
  queryOptions({
    queryKey: productGroupsQueryKeys.listPage(input),
    queryFn: () => unwrapApiResult(fetchProductGroups(input)),
  });

export const productVariantsListQueryOptions = (
  fetchProductVariants: ProductVariantsFetcher,
  input?: PaginationSearchInput
) =>
  queryOptions({
    queryKey: productVariantsQueryKeys.listPage(input),
    queryFn: () => unwrapApiResult(fetchProductVariants(input)),
  });
