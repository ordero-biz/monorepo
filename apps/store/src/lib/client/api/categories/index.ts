'use client';

import { apiFetch } from '@ordero/api-client';
import type { Category, CategoryStatus } from '@/lib/domain/categories';
import type { PaginatedResponse } from '@/lib/server/types';
import { tokenizePath } from '@/lib/utils/tokenizePath';
import {
  getPaginationSearch,
  type PaginationSearchInput,
} from '@/lib/utils/url';
import { CLIENT_BACKEND_PATHS } from '../path';

type CategoriesListResponse = PaginatedResponse<Category>;

export const getCategoriesPath = (input?: PaginationSearchInput) =>
  `${CLIENT_BACKEND_PATHS.categories}?${getPaginationSearch(input)}`;

export const getCategories = (input?: PaginationSearchInput) =>
  apiFetch<CategoriesListResponse>(getCategoriesPath(input), {
    method: 'GET',
  });

type CategoryInput = {
  name: string;
  parentId: number | null;
};

type CreateCategoryInput = CategoryInput & {
  status: CategoryStatus;
};

type UpdateCategoryInput = CategoryInput & {
  categoryId: string | number;
};

export const getCategory = (categoryId: string | number) =>
  apiFetch<Category>(
    tokenizePath(CLIENT_BACKEND_PATHS.category, { id: categoryId }),
    {
      method: 'GET',
    }
  );

export const getCategoryChildren = (parentId: string | number) =>
  apiFetch<Category[]>(
    tokenizePath(CLIENT_BACKEND_PATHS.categoryChildren, { parentId }),
    {
      method: 'GET',
    }
  );

export const createCategory = (input: CreateCategoryInput) =>
  apiFetch<Category>(CLIENT_BACKEND_PATHS.categories, {
    method: 'POST',
    body: input,
  });

export const updateCategory = ({ categoryId, ...input }: UpdateCategoryInput) =>
  apiFetch<Category>(
    tokenizePath(CLIENT_BACKEND_PATHS.category, { id: categoryId }),
    {
      method: 'PATCH',
      body: input,
    }
  );
