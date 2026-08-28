import { Chip } from '@ordero/ui';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import type { WarehouseStatusChipProps } from './types';

const statusLabels = {
  [WAREHOUSE_STATUS.ACTIVE]: 'Active',
  [WAREHOUSE_STATUS.DRAFT]: 'Draft',
} as const;

export const WarehouseStatusChip = ({ status }: WarehouseStatusChipProps) => {
  if (!status) {
    return null;
  }

  return (
    <Chip
      color={status === WAREHOUSE_STATUS.ACTIVE ? 'primary' : 'warning'}
      size="s"
      variant="soft"
    >
      {statusLabels[status]}
    </Chip>
  );
};
