import type { CreateTransferData } from '@/lib/client/api/transfers';
import type { TransferStatus } from '@/lib/domain/transfers/types';
import {
  getTransferEntriesPayload,
  type TransferFormValues,
} from '../../../shared/TransferEditorForm';

export const getCreateTransferData = (
  value: TransferFormValues,
  status: TransferStatus
): CreateTransferData => {
  const comment = value.comment.trim();

  return {
    sourceWarehouseId: Number(value.sourceWarehouse?.id),
    destinationWarehouseId: Number(value.destinationWarehouse?.id),
    transferNumber: value.transferNumber.trim(),
    status,
    transferEntries: getTransferEntriesPayload(value),
    ...(comment ? { comment } : {}),
  };
};
