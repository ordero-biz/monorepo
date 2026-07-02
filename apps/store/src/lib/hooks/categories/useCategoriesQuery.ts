'use client';

import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/lib/client/api/categories';
import { categoriesListQueryOptions } from '@/lib/query/categories/categoriesQueryOptions';

export const useCategoriesQuery = () =>
  useQuery(categoriesListQueryOptions(getCategories));
