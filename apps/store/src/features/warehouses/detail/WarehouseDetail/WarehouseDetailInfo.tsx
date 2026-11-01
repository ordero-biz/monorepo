import { Card, Typography } from '@ordero/ui';
import type { Warehouse } from '@/lib/domain/warehouses/types';
import type { WarehouseDetailField, WarehouseDetailInfoProps } from './types';

const getWarehouseDetailData = (
  warehouse: Warehouse
): WarehouseDetailField[] => [
  {
    label: 'Address',
    value: warehouse.address,
  },
  {
    label: 'Comment',
    value: warehouse.comment,
  },
];

export const WarehouseDetailInfo = ({
  warehouse,
}: WarehouseDetailInfoProps) => {
  return (
    <Card.Root variant="filled">
      <Card.Header>
        <Card.Title>Warehouse details</Card.Title>
      </Card.Header>
      <Card.Content>
        <dl className="grid gap-[var(--space-2)] sm:grid-cols-2">
          {getWarehouseDetailData(warehouse).map((field) => (
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
};
