'use client';

import { useQuery } from '@tanstack/react-query';
import { getCategory } from '@/lib/client/api/categories';
import { categoryQueryOptions } from '@/lib/query/categories/categoriesQueryOptions';

export const useCategoryQuery = (categoryId: string | number) =>
  useQuery(categoryQueryOptions(categoryId, getCategory));
