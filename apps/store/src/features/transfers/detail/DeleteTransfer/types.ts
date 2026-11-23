import type { TransferDetails } from '@/lib/domain/transfers/types';

export type DeleteTransferDialogProps = {
  transfer: Pick<TransferDetails, 'id' | 'transferNumber'>;
  onDeleted?: () => void | Promise<void>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};
