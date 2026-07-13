'use client';

import { apiFetch } from '@ordero/api-client';
import type { Warehouse } from '@/lib/domain/warehouses';
import type { PaginatedResponse } from '@/lib/server/types';
import { tokenizePath } from '@/lib/utils/tokenizePath';
import {
  getPaginationSearch,
  type PaginationSearchInput,
} from '@/lib/utils/url';
import { CLIENT_BACKEND_PATHS } from '../path';

type WarehousesListResponse = PaginatedResponse<Warehouse>;

type CreateWarehouseInput = {
  code: string;
  name: string;
  address: string;
  comment: string;
};

export const getWarehousesPath = (input?: PaginationSearchInput) =>
  `${CLIENT_BACKEND_PATHS.warehouses}?${getPaginationSearch(input)}`;

export const getWarehouses = (input?: PaginationSearchInput) =>
  apiFetch<WarehousesListResponse>(getWarehousesPath(input), {
    method: 'GET',
  });

export const getWarehouse = (warehouseId: string | number) =>
  apiFetch<Warehouse>(
    tokenizePath(CLIENT_BACKEND_PATHS.warehouse, { id: warehouseId }),
    {
      method: 'GET',
    }
  );

export const createWarehouse = (input: CreateWarehouseInput) =>
  apiFetch<Warehouse>(CLIENT_BACKEND_PATHS.warehouses, {
    method: 'POST',
    body: input,
  });
