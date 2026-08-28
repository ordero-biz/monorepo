import { Chip } from '@ordero/ui';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/unitsOfMeasurement';
import type { UnitOfMeasurementStatusChipProps } from './types';

const statusLabels = {
  [UNIT_OF_MEASUREMENT_STATUS.ACTIVE]: 'Active',
  [UNIT_OF_MEASUREMENT_STATUS.DRAFT]: 'Draft',
} as const;

export const UnitOfMeasurementStatusChip = ({
  status,
}: UnitOfMeasurementStatusChipProps) => (
  <Chip
    color={status === UNIT_OF_MEASUREMENT_STATUS.ACTIVE ? 'primary' : 'warning'}
    size="s"
    variant="soft"
  >
    {statusLabels[status]}
  </Chip>
);
