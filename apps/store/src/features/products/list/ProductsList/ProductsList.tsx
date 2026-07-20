'use client';

import {
  useProductsQuery,
  useProductVariantsQuery,
} from '@/lib/hooks/products/useProductsQuery';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { Button, Card, DataTable, Typography } from '@/ui/index';
import { productGroupColumns, productVariantColumns } from './columns';
import { PRODUCTS_LIST_MODE } from './constants';
import type { ProductsListProps } from './types';

export const ProductsList = ({
  listMode,
  paginationInput,
}: ProductsListProps) => {
  const isProductsMode = listMode === PRODUCTS_LIST_MODE.products;
  const productsQuery = useProductVariantsQuery(paginationInput, {
    enabled: isProductsMode,
  });
  const productGroupsQuery = useProductsQuery(paginationInput, {
    enabled: !isProductsMode,
  });
  const selectedProductsQuery = isProductsMode
    ? productsQuery
    : productGroupsQuery;
  const tablePagination = useTablePagination({
    pageMetadata: selectedProductsQuery.data?.page,
    paginationInput,
  });

  if (selectedProductsQuery.isPending) {
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

  if (selectedProductsQuery.isError) {
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
                onClick={() => selectedProductsQuery.refetch()}
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

  if (isProductsMode) {
    return (
      <DataTable
        ariaLabel="Products list"
        columns={productVariantColumns}
        data={productsQuery.data?.content ?? []}
        emptyMessage="No products found."
        getRowId={(row) => String(row.id)}
        manualPagination
        pagination={tablePagination}
      />
    );
  }

  return (
    <DataTable
      ariaLabel="Products list"
      columns={productGroupColumns}
      data={productGroupsQuery.data?.content ?? []}
      emptyMessage="No products found."
      getRowId={(row) => String(row.id)}
      manualPagination
      pagination={tablePagination}
    />
  );
};
