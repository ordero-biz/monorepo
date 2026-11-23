import type { TransferDetails } from '@/lib/domain/transfers/types';

export type TransferDetailProps = {
  transferId: string;
};

export type TransferDetailHeaderProps = {
  transfer: TransferDetails;
};
