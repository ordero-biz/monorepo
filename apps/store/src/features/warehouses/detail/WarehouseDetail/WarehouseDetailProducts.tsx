'use client';

import { Button, Card, DataTable, Typography } from '@ordero/ui';
import type { WarehouseStockItem } from '@/lib/domain/warehouses/types';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { useWarehouseStockQuery } from '@/lib/hooks/warehouses/useWarehouseStockQuery';
import { columns } from './columns';
import type { WarehouseDetailProductsProps } from './types';

const getStockRowId = (item: WarehouseStockItem) =>
  `${item.productVariant.id}-${item.unitOfMeasurement.id}`;

export const WarehouseDetailProducts = ({
  warehouseId,
  paginationInput,
}: WarehouseDetailProductsProps) => {
  const warehouseStockQuery = useWarehouseStockQuery(
    warehouseId,
    paginationInput
  );
  const tablePagination = useTablePagination({
    pageMetadata: warehouseStockQuery.data?.page,
    paginationInput,
  });

  if (warehouseStockQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading warehouse products...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (warehouseStockQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load this warehouse&apos;s products right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => warehouseStockQuery.refetch()}
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
      ariaLabel="Warehouse products"
      columns={columns}
      data={warehouseStockQuery.data.content}
      emptyMessage="No products found in this warehouse."
      getRowId={getStockRowId}
      manualPagination
      pagination={tablePagination}
    />
  );
};
