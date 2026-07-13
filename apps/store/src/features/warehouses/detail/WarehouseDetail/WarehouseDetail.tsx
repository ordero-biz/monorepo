'use client';

import { useWarehouseQuery } from '@/lib/hooks/warehouses/useWarehouseQuery';
import { Button, Card, PageHeader, Typography } from '@/ui/index';
import type { WarehouseDetailProps } from './types';
import { WarehouseDetailInfo } from './WarehouseDetailInfo';

export const WarehouseDetail = ({ warehouseId }: WarehouseDetailProps) => {
  const warehouseQuery = useWarehouseQuery(warehouseId);

  if (warehouseQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading warehouse...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (warehouseQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load this warehouse right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => warehouseQuery.refetch()}
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
          <Typography variant="h5">{warehouseQuery.data.name}</Typography>
        </PageHeader.Left>
      </PageHeader.Root>
      <WarehouseDetailInfo warehouse={warehouseQuery.data} />
    </div>
  );
};
