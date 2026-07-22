import type { ApiResult } from '@ordero/api-types';
import { queryOptions } from '@tanstack/react-query';
import type { Category } from '@/lib/domain/categories';
import type { PaginatedResponse } from '@/lib/server/types';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { categoriesQueryKeys } from './categoriesQueryKeys';

type CategoriesFetcher = (
  input?: PaginationSearchInput
) => Promise<ApiResult<PaginatedResponse<Category>>>;

type CategoryFetcher = (
  categoryId: string | number
) => Promise<ApiResult<Category>>;

type CategoryChildrenFetcher = (
  parentId: string | number
) => Promise<ApiResult<Category[]>>;

const unwrapApiResult = async <T>(request: Promise<ApiResult<T>>) => {
  const result = await request;

  if (!result.ok) {
    throw result.error;
  }

  return result.data;
};

export const categoriesListQueryOptions = (
  fetchCategories: CategoriesFetcher,
  input?: PaginationSearchInput
) =>
  queryOptions({
    queryKey: categoriesQueryKeys.listPage(input),
    queryFn: () => unwrapApiResult(fetchCategories(input)),
  });

export const categoryQueryOptions = (
  categoryId: string | number,
  fetchCategory: CategoryFetcher
) =>
  queryOptions({
    queryKey: categoriesQueryKeys.detail(categoryId),
    queryFn: () => unwrapApiResult(fetchCategory(categoryId)),
  });

export const categoryChildrenQueryOptions = (
  parentId: string | number,
  fetchCategoryChildren: CategoryChildrenFetcher
) =>
  queryOptions({
    queryKey: categoriesQueryKeys.children(parentId),
    queryFn: () => unwrapApiResult(fetchCategoryChildren(parentId)),
  });
