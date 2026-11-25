import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import { Chip } from '@/ui/index';
import type { SupplierStatusChipProps } from './types';

const statusLabels = {
  [SUPPLIER_STATUS.ACTIVE]: 'Active',
  [SUPPLIER_STATUS.DRAFT]: 'Draft',
} as const;

export const SupplierStatusChip = ({ status }: SupplierStatusChipProps) => (
  <Chip
    color={status === SUPPLIER_STATUS.ACTIVE ? 'primary' : 'warning'}
    size="s"
    variant="soft"
  >
    {statusLabels[status]}
  </Chip>
);
