'use client';

import { apiFetch } from '@ordero/api-client';
import type {
  Transfer,
  TransferDetails,
  TransferStatus,
} from '@/lib/domain/transfers/types';
import type { PaginatedResponse } from '@/lib/server/types';
import {
  getPaginationSearch,
  type PaginationSearchInput,
} from '@/lib/utils/url';
import { CLIENT_BACKEND_PATHS } from '../path';

type TransfersListResponse = PaginatedResponse<Transfer>;

export type TransferEntryData = {
  productVariantId: number;
  unitOfMeasurementId: number;
  quantity: number;
  comment?: string;
};

export type CreateTransferData = {
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  transferNumber: string;
  status: TransferStatus;
  comment?: string;
  transferEntries?: TransferEntryData[];
};

export const getTransfersPath = (input?: PaginationSearchInput) =>
  `${CLIENT_BACKEND_PATHS.warehouseTransfers}?${getPaginationSearch(input)}`;

export const getTransfers = (input?: PaginationSearchInput) =>
  apiFetch<TransfersListResponse>(getTransfersPath(input), {
    method: 'GET',
  });

export const createTransfer = (input: CreateTransferData) =>
  apiFetch<TransferDetails>(CLIENT_BACKEND_PATHS.warehouseTransfers, {
    method: 'POST',
    body: input,
  });
