'use client';

import { useProductsQuery } from '@/lib/hooks/products/useProductsQuery';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { Button, Card, DataTable, Typography } from '@/ui/index';
import { columns } from './columns';
import { ProductsListProps } from './types';

export const ProductsList = ({ paginationInput }: ProductsListProps) => {
  const productsQuery = useProductsQuery(paginationInput);
  const tablePagination = useTablePagination({
    pageMetadata: productsQuery.data?.page,
    paginationInput,
  });

  if (productsQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading products...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (productsQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load your products right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => productsQuery.refetch()}
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
      ariaLabel="Products list"
      columns={columns}
      data={productsQuery.data.content}
      emptyMessage="No products found."
      getRowId={(row) => String(row.id)}
      manualPagination
      pagination={tablePagination}
    />
  );
};
