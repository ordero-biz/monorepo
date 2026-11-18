import type { CreateTransferData } from '@/lib/client/api/transfers';
import type { TransferStatus } from '@/lib/domain/transfers/types';
import type { TransferFormValues } from '../types';
import { isBlankTransferEntry } from './entries';

export const getCreateTransferData = (
  value: TransferFormValues,
  status: TransferStatus
): CreateTransferData => {
  const comment = value.comment.trim();
  const transferEntries = value.transferEntries
    .filter((entry) => !isBlankTransferEntry(entry))
    .map((entry) => {
      const entryComment = entry.comment.trim();

      return {
        productVariantId: Number(entry.stockItem?.productVariant.id),
        unitOfMeasurementId: Number(entry.stockItem?.unitOfMeasurement.id),
        quantity: Number(entry.quantity),
        ...(entryComment ? { comment: entryComment } : {}),
      };
    });

  return {
    sourceWarehouseId: Number(value.sourceWarehouse?.id),
    destinationWarehouseId: Number(value.destinationWarehouse?.id),
    transferNumber: value.transferNumber.trim(),
    status,
    transferEntries,
    ...(comment ? { comment } : {}),
  };
};
