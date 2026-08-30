'use client';

import { apiFetch } from '@ordero/api-client';
import type { Supply } from '@/lib/domain/supplies';
import type { PaginatedResponse } from '@/lib/server/types';
import {
  getPaginationSearch,
  type PaginationSearchInput,
} from '@/lib/utils/url';
import { CLIENT_BACKEND_PATHS } from '../path';

type SuppliesListResponse = PaginatedResponse<Supply>;

export const getSuppliesPath = (input?: PaginationSearchInput) =>
  `${CLIENT_BACKEND_PATHS.supplies}?${getPaginationSearch(input)}`;

export const getSupplies = (input?: PaginationSearchInput) =>
  apiFetch<SuppliesListResponse>(getSuppliesPath(input), {
    method: 'GET',
  });
