import { Chip } from '@ordero/ui';
import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
import type { AttributeStatusChipProps } from './types';

const statusLabels = {
  [ATTRIBUTE_STATUS.ACTIVE]: 'Active',
  [ATTRIBUTE_STATUS.DRAFT]: 'Draft',
} as const;

export const AttributeStatusChip = ({ status }: AttributeStatusChipProps) => {
  if (!status) {
    return null;
  }

  return (
    <Chip
      color={status === ATTRIBUTE_STATUS.ACTIVE ? 'primary' : 'warning'}
      size="s"
      variant="soft"
    >
      {statusLabels[status]}
    </Chip>
  );
};
