'use client';

import { useProductGroupsQuery } from '@/lib/hooks/products/useProductGroupsQuery';
import { useProductVariantsQuery } from '@/lib/hooks/products/useProductVariantsQuery';
import { getTablePagination } from '@/lib/hooks/useTablePagination';
import { Button, Card, DataTable, Typography } from '@/ui/index';
import { productGroupColumns, productVariantColumns } from './columns';
import { PRODUCTS_LIST_MODE } from './constants';
import type { ProductsListProps } from './types';

export const ProductsList = ({
  listMode,
  pagination,
  paginationInput,
}: ProductsListProps) => {
  const isProductVariantsMode = listMode === PRODUCTS_LIST_MODE.productVariants;

  const productVariantsQuery = useProductVariantsQuery(paginationInput, {
    enabled: isProductVariantsMode,
  });

  const productGroupsQuery = useProductGroupsQuery(paginationInput, {
    enabled: !isProductVariantsMode,
  });

  const selectedProductListQuery = isProductVariantsMode
    ? productVariantsQuery
    : productGroupsQuery;

  const tablePagination = getTablePagination({
    pageMetadata: selectedProductListQuery.data?.page,
    pagination,
  });

  if (selectedProductListQuery.isPending) {
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

  if (selectedProductListQuery.isError) {
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
                onClick={() => selectedProductListQuery.refetch()}
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

  if (isProductVariantsMode) {
    return (
      <DataTable
        ariaLabel="Products list"
        columns={productVariantColumns}
        data={productVariantsQuery.data?.content ?? []}
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
