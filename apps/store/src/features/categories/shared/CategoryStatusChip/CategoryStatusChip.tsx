import { Chip } from '@ordero/ui';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import type { CategoryStatusChipProps } from './types';

const statusLabels = {
  [CATEGORY_STATUS.ACTIVE]: 'Active',
  [CATEGORY_STATUS.DRAFT]: 'Draft',
} as const;

export const CategoryStatusChip = ({ status }: CategoryStatusChipProps) => {
  if (!status) {
    return null;
  }

  return (
    <Chip
      color={status === CATEGORY_STATUS.ACTIVE ? 'primary' : 'warning'}
      size="s"
      variant="soft"
    >
      {statusLabels[status]}
    </Chip>
  );
};
