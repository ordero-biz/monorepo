'use client';

import { apiFetch } from '@ordero/api-client';
import type { Warehouse, WarehouseStatus } from '@/lib/domain/warehouses';
import type { PaginatedResponse } from '@/lib/server/types';
import { tokenizePath } from '@/lib/utils/tokenizePath';
import {
  getPaginationSearch,
  type PaginationSearchInput,
} from '@/lib/utils/url';
import { CLIENT_BACKEND_PATHS } from '../path';

type WarehousesListResponse = PaginatedResponse<Warehouse>;

export type CreateWarehouseData = {
  name: string;
  address?: string | null;
  comment: string;
  status: WarehouseStatus;
};

export type UpdateWarehouseFieldData = Partial<CreateWarehouseData>;

export type UpdateWarehouseData = UpdateWarehouseFieldData & {
  warehouseId: string | number;
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

export const createWarehouse = (input: CreateWarehouseData) =>
  apiFetch<Warehouse>(CLIENT_BACKEND_PATHS.warehouses, {
    method: 'POST',
    body: input,
  });

export const updateWarehouse = ({
  warehouseId,
  ...input
}: UpdateWarehouseData) =>
  apiFetch<Warehouse>(
    tokenizePath(CLIENT_BACKEND_PATHS.warehouse, { id: warehouseId }),
    {
      method: 'PATCH',
      body: input,
    }
  );
