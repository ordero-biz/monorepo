import type { TransferDetails } from '@/lib/domain/transfers/types';

export type UpdateTransferProps = {
  transfer: TransferDetails;
  referenceTime?: number;
  onDeleted?: () => Promise<void> | void;
};

export type TransferDetailHeaderProps = {
  transfer: TransferDetails;
  referenceTime?: number;
  onDeleted?: () => Promise<void> | void;
};
