import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import { Chip } from '@/ui/index';
import type { TransferStatusChipProps } from './types';

const statusLabels = {
  [TRANSFER_STATUS.DRAFT]: 'Draft',
  [TRANSFER_STATUS.IN_TRANSIT]: 'In transit',
  [TRANSFER_STATUS.COMPLETED]: 'Completed',
} as const;

const statusColors = {
  [TRANSFER_STATUS.DRAFT]: 'warning',
  [TRANSFER_STATUS.IN_TRANSIT]: 'info',
  [TRANSFER_STATUS.COMPLETED]: 'primary',
} as const;

export const TransferStatusChip = ({ status }: TransferStatusChipProps) => (
  <Chip color={statusColors[status]} size="s" variant="soft">
    {statusLabels[status]}
  </Chip>
);
