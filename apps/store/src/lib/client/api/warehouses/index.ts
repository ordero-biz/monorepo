'use client';

import { apiFetch } from '@ordero/api-client';
import {
  type GetWarehousesInput,
  getWarehousesSearch,
  type Warehouse,
} from '@/lib/domain/warehouses';
import type { PaginatedResponse } from '@/lib/server/types';
import { CLIENT_BACKEND_PATHS } from '../path';

type WarehousesListResponse = PaginatedResponse<Warehouse>;

type CreateWarehouseInput = {
  code: string;
  name: string;
  address: string;
  comment: string;
};

export const getWarehousesPath = (input?: GetWarehousesInput) =>
  `${CLIENT_BACKEND_PATHS.warehouses}?${getWarehousesSearch(input)}`;

export const getWarehouses = (input?: GetWarehousesInput) =>
  apiFetch<WarehousesListResponse>(getWarehousesPath(input), {
    method: 'GET',
  });

export const createWarehouse = (input: CreateWarehouseInput) =>
  apiFetch<Warehouse>(CLIENT_BACKEND_PATHS.warehouses, {
    method: 'POST',
    body: input,
  });
