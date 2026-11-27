'use client';

import { Button, Card, DataTable, Typography } from '@ordero/ui';
import { useMemo } from 'react';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { useWarehouseTransfersQuery } from '@/lib/hooks/warehouses/useWarehouseTransfersQuery';
import { createWarehouseTransferColumns } from './transferColumns';
import type { WarehouseDetailMovementsProps } from './types';
import { WarehouseDetailListHeader } from './WarehouseDetailListHeader';

export const WarehouseDetailMovements = ({
  warehouseId,
  paginationInput,
  headerActions,
}: WarehouseDetailMovementsProps) => {
  const transfersQuery = useWarehouseTransfersQuery(
    warehouseId,
    paginationInput
  );
  const columns = useMemo(
    () => createWarehouseTransferColumns(warehouseId),
    [warehouseId]
  );
  const pagination = useTablePagination({
    pageMetadata: transfersQuery.data?.page,
    paginationInput,
  });

  const header = (
    <WarehouseDetailListHeader
      title="Movements"
      total={transfersQuery.data?.page.totalElements}
      actions={headerActions}
    />
  );

  if (transfersQuery.isPending || transfersQuery.isError) {
    return (
      <Card.Root>
        <Card.Content>{header}</Card.Content>
        <Card.Content>
          {transfersQuery.isPending ? (
            <Typography color="text-secondary" variant="body2">
              Loading warehouse movements...
            </Typography>
          ) : (
            <div className="flex flex-col gap-[var(--space-2)]">
              <Typography variant="body2">
                We couldn&apos;t load this warehouse&apos;s movements right now.
              </Typography>
              <div>
                <Button
                  color="inherit"
                  onClick={() => transfersQuery.refetch()}
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
      ariaLabel="Warehouse movements"
      columns={columns}
      data={transfersQuery.data.content}
      emptyMessage="No movements for this warehouse yet."
      getRowId={(transfer) => String(transfer.id)}
      header={header}
      manualPagination
      pagination={pagination}
    />
  );
};
