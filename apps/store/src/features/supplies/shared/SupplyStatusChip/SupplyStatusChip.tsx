import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import { Chip } from '@/ui/index';
import type { SupplyStatusChipProps } from './types';

const statusLabels = {
  [SUPPLY_STATUS.COMPLETED]: 'Completed',
  [SUPPLY_STATUS.DRAFT]: 'Draft',
} as const;

export const SupplyStatusChip = ({ status }: SupplyStatusChipProps) => (
  <Chip
    color={status === SUPPLY_STATUS.COMPLETED ? 'primary' : 'warning'}
    size="s"
    variant="soft"
  >
    {statusLabels[status]}
  </Chip>
);
