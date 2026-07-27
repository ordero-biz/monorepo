'use client';

import { apiFetch } from '@ordero/api-client';
import type { ProductGroup, ProductVariant } from '@/lib/domain/products';
import type { PaginatedResponse } from '@/lib/server/types';
import {
  getPaginationSearch,
  type PaginationSearchInput,
} from '@/lib/utils/url';
import { CLIENT_BACKEND_PATHS } from '../path';

type ProductGroupsListResponse = PaginatedResponse<ProductGroup>;
type ProductVariantsListResponse = PaginatedResponse<ProductVariant>;

type CreateProductGroupInput = {
  categoryId: number;
  description: string;
  name: string;
};

export const getProductGroupsPath = (input?: PaginationSearchInput) =>
  `${CLIENT_BACKEND_PATHS.productGroups}?${getPaginationSearch(input)}`;

export const getProductVariantsPath = (input?: PaginationSearchInput) =>
  `${CLIENT_BACKEND_PATHS.productVariants}?${getPaginationSearch(input)}`;

export const getProductGroups = (input?: PaginationSearchInput) =>
  apiFetch<ProductGroupsListResponse>(getProductGroupsPath(input), {
    method: 'GET',
  });

export const getProductVariants = (input?: PaginationSearchInput) =>
  apiFetch<ProductVariantsListResponse>(getProductVariantsPath(input), {
    method: 'GET',
  });

export const createProductGroup = (input: CreateProductGroupInput) =>
  apiFetch<ProductGroup>(CLIENT_BACKEND_PATHS.productGroups, {
    method: 'POST',
    body: input,
  });
