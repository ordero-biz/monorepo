'use client';

import { apiFetch } from '@ordero/api-client';
import type {
  TransferDetails,
  TransferStatus,
} from '@/lib/domain/transfers/types';
import { CLIENT_BACKEND_PATHS } from '../path';

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

export const createTransfer = (input: CreateTransferData) =>
  apiFetch<TransferDetails>(CLIENT_BACKEND_PATHS.warehouseTransfers, {
    method: 'POST',
    body: input,
  });
