import type { UnitOfMeasurement } from '@/lib/domain/unitsOfMeasurement';
import { Card, Typography } from '@/ui/index';
import type {
  UnitOfMeasurementDetailField,
  UnitOfMeasurementDetailInfoProps,
} from './types';

const getUnitOfMeasurementDetailData = (
  unitOfMeasurement: UnitOfMeasurement
): UnitOfMeasurementDetailField[] => [
  {
    label: 'Symbol',
    value: unitOfMeasurement.symbol,
  },
  {
    label: 'Comment',
    value: unitOfMeasurement.comment,
  },
];

export const UnitOfMeasurementDetailInfo = ({
  unitOfMeasurement,
}: UnitOfMeasurementDetailInfoProps) => (
  <Card.Root variant="filled">
    <Card.Header>
      <Card.Title>Unit of measurement details</Card.Title>
    </Card.Header>
    <Card.Content>
      <dl className="grid gap-[var(--space-2)] sm:grid-cols-2">
        {getUnitOfMeasurementDetailData(unitOfMeasurement).map((field) => (
          <div
            className="flex min-w-0 flex-col gap-[var(--space-1)]"
            key={field.label}
          >
            <dt>
              <Typography color="text-secondary" variant="body2">
                {field.label}
              </Typography>
            </dt>
            <dd className="min-w-0 break-words">
              <Typography variant="body1">{field.value || '-'}</Typography>
            </dd>
          </div>
        ))}
      </dl>
    </Card.Content>
  </Card.Root>
);
