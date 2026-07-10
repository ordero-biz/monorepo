'use client';

import { useSuppliersQuery } from '@/lib/hooks/suppliers/useSuppliersQuery';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { Button, Card, DataTable, Typography } from '@/ui/index';
import { columns } from './columns';

type SuppliersListProps = {
  paginationInput?: PaginationSearchInput;
};

export const SuppliersList = ({ paginationInput }: SuppliersListProps) => {
  const suppliersQuery = useSuppliersQuery(paginationInput);
  const tablePagination = useTablePagination({
    pageMetadata: suppliersQuery.data?.page,
    paginationInput,
  });

  if (suppliersQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading suppliers...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (suppliersQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load your suppliers right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => suppliersQuery.refetch()}
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
      ariaLabel="Suppliers list"
      columns={columns}
      data={suppliersQuery.data.content}
      emptyMessage="No suppliers found."
      getRowId={(row) => String(row.id)}
      manualPagination
      pagination={tablePagination}
    />
  );
};
