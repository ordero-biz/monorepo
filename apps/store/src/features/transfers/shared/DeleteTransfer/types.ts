import type { Transfer } from '@/lib/domain/transfers/types';

export type DeleteTransferDialogProps = {
  disabled?: boolean;
  transfer: Pick<Transfer, 'id' | 'transferNumber'>;
  onDeleted?: () => void | Promise<void>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};
