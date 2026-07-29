'use client';

import { useQuery } from '@tanstack/react-query';
import { getCategoryChildren } from '@/lib/client/api/categories';
import { categoryChildrenQueryOptions } from '@/lib/query/categories/categoriesQueryOptions';

export const useCategoryChildrenQuery = (parentId: string | number) =>
  useQuery(categoryChildrenQueryOptions(parentId, getCategoryChildren));
