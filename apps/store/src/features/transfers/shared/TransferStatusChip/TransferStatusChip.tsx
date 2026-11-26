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

const InTransitIndicator = () => (
  <span className="relative flex size-[var(--space-0-75)]">
    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--info-main)] opacity-75" />
    <span className="relative inline-flex size-[var(--space-0-75)] rounded-full bg-[var(--info-main)]" />
  </span>
);

export const TransferStatusChip = ({ status }: TransferStatusChipProps) => (
  <Chip
    color={statusColors[status]}
    size="s"
    startIcon={
      status === TRANSFER_STATUS.IN_TRANSIT ? <InTransitIndicator /> : undefined
    }
    variant="soft"
  >
    {statusLabels[status]}
  </Chip>
);
