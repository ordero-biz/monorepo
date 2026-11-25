'use client';

import { useQuery } from '@tanstack/react-query';
import { getProductVariants } from '@/lib/client/api/products';
import { productVariantsListQueryOptions } from '@/lib/query/products/productsQueryOptions';
import type { PaginationSearchInput } from '@/lib/utils/url';

type ProductVariantsQueryOptions = {
  enabled?: boolean;
};

export const useProductVariantsQuery = (
  input?: PaginationSearchInput,
  options?: ProductVariantsQueryOptions
) =>
  useQuery({
    ...productVariantsListQueryOptions(getProductVariants, input),
    enabled: options?.enabled,
  });
