'use client';

import type { SelectOption } from '@ordero/ui';
import { useMemo } from 'react';
import { useCategoriesQuery } from '@/lib/hooks/categories/useCategoriesQuery';
import { productsCategoriesQueryInput } from './productsCategoriesQueryConfig';

export const useProductsCategoriesSelectQuery = () => {
  const categoriesQuery = useCategoriesQuery(productsCategoriesQueryInput);
  const categoryOptions = useMemo<SelectOption[]>(
    () =>
      categoriesQuery.data?.content.map((category) => ({
        label: category.name,
        value: String(category.id),
      })) ?? [],
    [categoriesQuery.data?.content]
  );

  return {
    categoryOptions,
    isError: categoriesQuery.isError,
    isPending: categoriesQuery.isPending,
  };
};
