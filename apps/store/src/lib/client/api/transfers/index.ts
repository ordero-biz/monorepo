'use client';

import { apiFetch } from '@ordero/api-client';
import type {
  Transfer,
  TransferDetails,
  TransferStatus,
} from '@/lib/domain/transfers/types';
import type { PaginatedResponse } from '@/lib/server/types';
import { tokenizePath } from '@/lib/utils/tokenizePath';
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

export type UpdateTransferFieldData = Partial<
  Omit<CreateTransferData, 'comment'> & { comment: string | null }
>;

export type UpdateTransferData = UpdateTransferFieldData & {
  transferId: string | number;
  expectedVersion: number;
};

export const getTransfersPath = (input?: PaginationSearchInput) =>
  `${CLIENT_BACKEND_PATHS.transfers}?${getPaginationSearch(input)}`;

export const getTransfers = (input?: PaginationSearchInput) =>
  apiFetch<TransfersListResponse>(getTransfersPath(input), {
    method: 'GET',
  });

export const getTransfer = (transferId: string | number) =>
  apiFetch<TransferDetails>(
    tokenizePath(CLIENT_BACKEND_PATHS.transfer, { id: transferId }),
    { method: 'GET' }
  );
export const createTransfer = (input: CreateTransferData) =>
  apiFetch<TransferDetails>(CLIENT_BACKEND_PATHS.transfers, {
    method: 'POST',
    body: input,
  });

export const updateTransfer = ({ transferId, ...input }: UpdateTransferData) =>
  apiFetch<TransferDetails>(
    tokenizePath(CLIENT_BACKEND_PATHS.transfer, { id: transferId }),
    {
      method: 'PATCH',
      body: input,
    }
  );

export const deleteTransfer = (transferId: string | number) =>
  apiFetch<void>(
    tokenizePath(CLIENT_BACKEND_PATHS.transfer, { id: transferId }),
    { method: 'DELETE' }
  );
