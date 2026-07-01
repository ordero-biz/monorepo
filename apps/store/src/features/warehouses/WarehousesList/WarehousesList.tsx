'use client';

import { Button, Card, DataTable, Typography } from '@ordero/ui';
import { useWarehousesQuery } from '@/lib/hooks/warehouses/useWarehousesQuery';
import { columns } from './columns';

export const WarehousesList = () => {
  const warehousesQuery = useWarehousesQuery();

  if (warehousesQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading warehouses...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (warehousesQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load your warehouses right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => warehousesQuery.refetch()}
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
    <DataTable
      ariaLabel="Warehouses list"
      columns={columns}
      data={warehousesQuery.data.content}
      emptyMessage="No warehouses found."
      getRowId={(row) => String(row.id)}
    />
  );
};
