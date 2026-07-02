'use client';

import { apiFetch } from '@ordero/api-client';
import type { Category } from '@/lib/domain/categories';
import type { PaginatedResponse } from '@/lib/server/types';
import { CLIENT_BACKEND_PATHS } from '../path';

type CategoriesListResponse = PaginatedResponse<Category>;

export const getCategories = () =>
  apiFetch<CategoriesListResponse>(CLIENT_BACKEND_PATHS.categories, {
    method: 'GET',
  });

type CreateCategoryInput = {
  name: string;
  parentId: number | null;
  sortOrder: number;
};

export const createCategory = (input: CreateCategoryInput) =>
  apiFetch<Category>(CLIENT_BACKEND_PATHS.categories, {
    method: 'POST',
    body: input,
  });
