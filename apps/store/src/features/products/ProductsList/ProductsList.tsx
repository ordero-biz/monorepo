'use client';

import { Button, Card, DataTable, Typography } from '@ordero/ui';
import { useProductsQuery } from '@/lib/hooks/products/useProductsQuery';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { columns } from './columns';

type ProductsListProps = {
  paginationInput?: PaginationSearchInput;
};

export const ProductsList = ({ paginationInput }: ProductsListProps) => {
  const productsQuery = useProductsQuery(paginationInput);

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
    />
  );
};
