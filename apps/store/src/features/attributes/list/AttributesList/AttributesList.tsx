'use client';

import { Button, Card, DataTable, Typography } from '@ordero/ui';
import { useAttributesQuery } from '@/lib/hooks/attributes/useAttributesQuery';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { columns } from './columns';

type AttributesListProps = {
  paginationInput?: PaginationSearchInput;
};

export const AttributesList = ({ paginationInput }: AttributesListProps) => {
  const attributesQuery = useAttributesQuery(paginationInput);
  const tablePagination = useTablePagination({
    pageMetadata: attributesQuery.data?.page,
    paginationInput,
  });

  if (attributesQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading attributes...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (attributesQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load your attributes right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => attributesQuery.refetch()}
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
      ariaLabel="Attributes list"
      columns={columns}
      data={attributesQuery.data.content}
      emptyMessage="No attributes found."
      getRowId={(row) => String(row.id)}
      manualPagination
      pagination={tablePagination}
    />
  );
};
