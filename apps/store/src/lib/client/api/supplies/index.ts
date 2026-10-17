'use client';

import { apiFetch } from '@ordero/api-client';
import type {
  Supply,
  SupplyDetails,
  SupplyStatus,
} from '@/lib/domain/supplies/types';
import type { PaginatedResponse } from '@/lib/server/types';
import { tokenizePath } from '@/lib/utils/tokenizePath';
import {
  getPaginationSearch,
  type PaginationSearchInput,
} from '@/lib/utils/url';
import { CLIENT_BACKEND_PATHS } from '../path';

type SuppliesListResponse = PaginatedResponse<Supply>;

export type SupplyEntryData = {
  productVariantId: number;
  unitOfMeasurementId: number;
  quantity: number;
  unitPrice: number;
  comment?: string | null;
};

export type CreateSupplyData = {
  supplierId: number;
  warehouseId: number;
  supplyNumber: string;
  status: SupplyStatus;
  supplierInvoiceNumber?: string | null;
  comment?: string | null;
  supplyEntries?: SupplyEntryData[];
};

export type UpdateSupplyFieldData = Partial<CreateSupplyData>;

export type UpdateSupplyData = UpdateSupplyFieldData & {
  supplyId: string | number;
  expectedVersion: number;
};

export const getSuppliesPath = (input?: PaginationSearchInput) =>
  `${CLIENT_BACKEND_PATHS.supplies}?${getPaginationSearch(input)}`;

export const getSupplies = (input?: PaginationSearchInput) =>
  apiFetch<SuppliesListResponse>(getSuppliesPath(input), {
    method: 'GET',
  });

export const getSupply = (supplyId: string | number) =>
  apiFetch<SupplyDetails>(
    tokenizePath(CLIENT_BACKEND_PATHS.supply, { id: supplyId }),
    { method: 'GET' }
  );

export const createSupply = (input: CreateSupplyData) =>
  apiFetch<SupplyDetails>(CLIENT_BACKEND_PATHS.supplies, {
    method: 'POST',
    body: input,
  });

export const updateSupply = ({ supplyId, ...input }: UpdateSupplyData) =>
  apiFetch<SupplyDetails>(
    tokenizePath(CLIENT_BACKEND_PATHS.supply, { id: supplyId }),
    {
      method: 'PATCH',
      body: input,
    }
  );
