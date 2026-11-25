import type { TransferDetails } from '@/lib/domain/transfers/types';

export type UpdateTransferProps = {
  transfer: TransferDetails;
  onDeleted?: () => Promise<void> | void;
};

export type TransferDetailHeaderProps = {
  transfer: TransferDetails;
  onDeleted?: () => Promise<void> | void;
};
