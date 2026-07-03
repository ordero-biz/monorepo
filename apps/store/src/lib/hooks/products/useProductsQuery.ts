'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/client/api/products';
import { productsListQueryOptions } from '@/lib/query/products/productsQueryOptions';
import type { PaginationSearchInput } from '@/lib/utils/url';

export const useProductsQuery = (input?: PaginationSearchInput) =>
  useQuery(productsListQueryOptions(getProducts, input));
