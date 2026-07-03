'use client';

import { apiFetch } from '@ordero/api-client';
import type { Product } from '@/lib/domain/products';
import type { PaginatedResponse } from '@/lib/server/types';
import {
  getPaginationSearch,
  type PaginationSearchInput,
} from '@/lib/utils/url';
import { CLIENT_BACKEND_PATHS } from '../path';

type ProductsListResponse = PaginatedResponse<Product>;

type CreateProductInput = {
  categoryId: number;
  description: string;
  name: string;
};

export const getProductsPath = (input?: PaginationSearchInput) =>
  `${CLIENT_BACKEND_PATHS.products}?${getPaginationSearch(input)}`;

export const getProducts = (input?: PaginationSearchInput) =>
  apiFetch<ProductsListResponse>(getProductsPath(input), {
    method: 'GET',
  });

export const createProduct = (input: CreateProductInput) =>
  apiFetch<Product>(CLIENT_BACKEND_PATHS.products, {
    method: 'POST',
    body: input,
  });
