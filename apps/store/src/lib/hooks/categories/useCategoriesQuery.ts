'use client';

import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/lib/client/api/categories';
import { categoriesListQueryOptions } from '@/lib/query/categories/categoriesQueryOptions';
import type { PaginationSearchInput } from '@/lib/utils/url';

export const useCategoriesQuery = (input?: PaginationSearchInput) =>
  useQuery(categoriesListQueryOptions(getCategories, input));
