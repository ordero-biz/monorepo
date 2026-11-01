'use client';

import { apiFetch } from '@ordero/api-client';
import type { Supplier, SupplierStatus } from '@/lib/domain/suppliers/types';
import type { PaginatedResponse } from '@/lib/server/types';
import { tokenizePath } from '@/lib/utils/tokenizePath';
import {
  getPaginationSearch,
  type PaginationSearchInput,
} from '@/lib/utils/url';
import { CLIENT_BACKEND_PATHS } from '../path';

type SuppliersListResponse = PaginatedResponse<Supplier>;

export type CreateSupplierData = {
  name: string;
  status: SupplierStatus;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  comment?: string | null;
};

export type UpdateSupplierFieldData = Partial<CreateSupplierData>;

export type UpdateSupplierData = UpdateSupplierFieldData & {
  supplierId: string | number;
};

export const getSuppliersPath = (input?: PaginationSearchInput) =>
  `${CLIENT_BACKEND_PATHS.suppliers}?${getPaginationSearch(input)}`;

export const getSuppliers = (input?: PaginationSearchInput) =>
  apiFetch<SuppliersListResponse>(getSuppliersPath(input), {
    method: 'GET',
  });

export const getSupplier = (supplierId: string | number) =>
  apiFetch<Supplier>(
    tokenizePath(CLIENT_BACKEND_PATHS.supplier, { id: supplierId }),
    {
      method: 'GET',
    }
  );

export const createSupplier = (input: CreateSupplierData) =>
  apiFetch<Supplier>(CLIENT_BACKEND_PATHS.suppliers, {
    method: 'POST',
    body: input,
  });

export const updateSupplier = ({ supplierId, ...input }: UpdateSupplierData) =>
  apiFetch<Supplier>(
    tokenizePath(CLIENT_BACKEND_PATHS.supplier, { id: supplierId }),
    {
      method: 'PATCH',
      body: input,
    }
  );
