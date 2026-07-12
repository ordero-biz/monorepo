'use client';

import { Button, Card, DataTable, Typography } from '@ordero/ui';
import { useUnitsOfMeasurementQuery } from '@/lib/hooks/units-of-measurement/useUnitsOfMeasurementQuery';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { columns } from './columns';

type UnitsOfMeasurementListProps = {
  paginationInput?: PaginationSearchInput;
};

export const UnitsOfMeasurementList = ({
  paginationInput,
}: UnitsOfMeasurementListProps) => {
  const unitsOfMeasurementQuery = useUnitsOfMeasurementQuery(paginationInput);
  const tablePagination = useTablePagination({
    pageMetadata: unitsOfMeasurementQuery.data?.page,
    paginationInput,
  });

  if (unitsOfMeasurementQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading units of measurement...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (unitsOfMeasurementQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load your units of measurement right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => unitsOfMeasurementQuery.refetch()}
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
      ariaLabel="Units of measurement list"
      columns={columns}
      data={unitsOfMeasurementQuery.data.content}
      emptyMessage="No units of measurement found."
      getRowId={(row) => String(row.id)}
      manualPagination
      pagination={tablePagination}
    />
  );
};
