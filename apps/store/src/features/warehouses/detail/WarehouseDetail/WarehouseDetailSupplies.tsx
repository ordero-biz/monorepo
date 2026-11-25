'use client';

import { Button, Card, DataTable, Typography } from '@ordero/ui';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { useWarehouseSuppliesQuery } from '@/lib/hooks/warehouses/useWarehouseSuppliesQuery';
import { supplyColumns } from './supplyColumns';
import type { WarehouseDetailSuppliesProps } from './types';
import { WarehouseDetailListHeader } from './WarehouseDetailListHeader';

export const WarehouseDetailSupplies = ({
  warehouseId,
  paginationInput,
  headerActions,
}: WarehouseDetailSuppliesProps) => {
  const suppliesQuery = useWarehouseSuppliesQuery(warehouseId, paginationInput);
  const pagination = useTablePagination({
    pageMetadata: suppliesQuery.data?.page,
    paginationInput,
  });

  const header = (
    <WarehouseDetailListHeader
      title="Supplies"
      total={suppliesQuery.data?.page.totalElements}
      actions={headerActions}
    />
  );

  if (suppliesQuery.isPending || suppliesQuery.isError) {
    return (
      <Card.Root>
        <Card.Content>{header}</Card.Content>
        <Card.Content>
          {suppliesQuery.isPending ? (
            <Typography color="text-secondary" variant="body2">
              Loading warehouse supplies...
            </Typography>
          ) : (
            <div className="flex flex-col gap-[var(--space-2)]">
              <Typography variant="body2">
                We couldn&apos;t load this warehouse&apos;s supplies right now.
              </Typography>
              <div>
                <Button
                  color="inherit"
                  onClick={() => suppliesQuery.refetch()}
                  size="s"
                  type="button"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}
        </Card.Content>
      </Card.Root>
    );
  }

  return (
    <DataTable
      ariaLabel="Warehouse supplies"
      columns={supplyColumns}
      data={suppliesQuery.data.content}
      emptyMessage="No supplies for this warehouse yet."
      getRowId={(supply) => String(supply.id)}
      header={header}
      manualPagination
      pagination={pagination}
    />
  );
};
