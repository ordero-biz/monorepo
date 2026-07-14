'use client';

import { useUnitOfMeasurementQuery } from '@/lib/hooks/units-of-measurement/useUnitOfMeasurementQuery';
import { Button, Card, PageHeader, Typography } from '@/ui/index';
import type { UnitOfMeasurementDetailProps } from './types';
import { UnitOfMeasurementDetailInfo } from './UnitOfMeasurementDetailInfo';

export const UnitOfMeasurementDetail = ({
  unitOfMeasurementId,
}: UnitOfMeasurementDetailProps) => {
  const unitOfMeasurementQuery = useUnitOfMeasurementQuery(unitOfMeasurementId);

  if (unitOfMeasurementQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading unit of measurement...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (unitOfMeasurementQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load this unit of measurement right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => unitOfMeasurementQuery.refetch()}
                size="s"
                type="button"
              >
                Retry
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <PageHeader.Root>
        <PageHeader.Left>
          <Typography variant="h5">
            {unitOfMeasurementQuery.data.name}
          </Typography>
        </PageHeader.Left>
      </PageHeader.Root>
      <UnitOfMeasurementDetailInfo
        unitOfMeasurement={unitOfMeasurementQuery.data}
      />
    </div>
  );
};
