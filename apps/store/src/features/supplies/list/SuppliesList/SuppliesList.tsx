'use client';

import { Button, Card, DataTable, Typography } from '@ordero/ui';
import { useSuppliesQuery } from '@/lib/hooks/supplies/useSuppliesQuery';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { columns } from './columns';
import type { SuppliesListProps } from './types';

export const SuppliesList = ({ paginationInput }: SuppliesListProps) => {
  const suppliesQuery = useSuppliesQuery(paginationInput);
  const tablePagination = useTablePagination({
    pageMetadata: suppliesQuery.data?.page,
    paginationInput,
  });

  if (suppliesQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading supplies...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (suppliesQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load your supplies right now.
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
        </Card.Content>
      </Card.Root>
    );
  }

  return (
    <DataTable
      ariaLabel="Supplies list"
      columns={columns}
      data={suppliesQuery.data.content}
      emptyMessage="No supplies found."
      getRowId={(row) => String(row.id)}
      manualPagination
      pagination={tablePagination}
    />
  );
};
