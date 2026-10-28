'use client';

import { Button, Card, Typography } from '@ordero/ui';
import { useWarehouseQuery } from '@/lib/hooks/warehouses/useWarehouseQuery';
import type { WarehouseDetailProps } from './types';
import { WarehouseDetailHeader } from './WarehouseDetailHeader';
import { WarehouseDetailInfo } from './WarehouseDetailInfo';
import { WarehouseDetailInventoryValue } from './WarehouseDetailInventoryValue';
import { WarehouseDetailProducts } from './WarehouseDetailProducts';

export const WarehouseDetail = ({
  warehouseId,
  paginationInput,
}: WarehouseDetailProps) => {
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
    <div className="flex min-w-0 flex-col gap-[var(--space-3)]">
      <WarehouseDetailHeader warehouse={warehouseQuery.data} />
      <div className="grid gap-[var(--space-2)] lg:grid-cols-3">
        <WarehouseDetailInventoryValue
          totalPrice={warehouseQuery.data.totalPrice}
        />
        <div className="grid min-w-0 lg:col-span-2">
          <WarehouseDetailInfo warehouse={warehouseQuery.data} />
        </div>
      </div>
      <WarehouseDetailProducts
        warehouseId={warehouseId}
        paginationInput={paginationInput}
      />
    </div>
  );
};
