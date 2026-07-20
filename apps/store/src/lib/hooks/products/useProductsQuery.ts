'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductVariants } from '@/lib/client/api/products';
import {
  productsListQueryOptions,
  productVariantsListQueryOptions,
} from '@/lib/query/products/productsQueryOptions';
import type { PaginationSearchInput } from '@/lib/utils/url';

type ProductsQueryOptions = {
  enabled?: boolean;
};

export const useProductsQuery = (
  input?: PaginationSearchInput,
  options?: ProductsQueryOptions
) =>
  useQuery({
    ...productsListQueryOptions(getProducts, input),
    enabled: options?.enabled,
  });

export const useProductVariantsQuery = (
  input?: PaginationSearchInput,
  options?: ProductsQueryOptions
) =>
  useQuery({
    ...productVariantsListQueryOptions(getProductVariants, input),
    enabled: options?.enabled,
  });
