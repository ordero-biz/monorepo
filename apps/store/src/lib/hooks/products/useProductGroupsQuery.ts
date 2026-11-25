'use client';

import { useQuery } from '@tanstack/react-query';
import { getProductGroups } from '@/lib/client/api/products';
import { productGroupsListQueryOptions } from '@/lib/query/products/productsQueryOptions';
import type { PaginationSearchInput } from '@/lib/utils/url';

type ProductGroupsQueryOptions = {
  enabled?: boolean;
};

export const useProductGroupsQuery = (
  input?: PaginationSearchInput,
  options?: ProductGroupsQueryOptions
) =>
  useQuery({
    ...productGroupsListQueryOptions(getProductGroups, input),
    enabled: options?.enabled,
  });
