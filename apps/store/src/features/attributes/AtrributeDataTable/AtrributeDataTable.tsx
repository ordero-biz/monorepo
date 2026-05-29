'use client';

import {
  Button,
  Card,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
  Typography,
} from '@ordero/ui';
import type { Attribute } from '@/lib/api/types';
import { useAttributesQuery } from '@/lib/hooks/useAttributesQuery';
import { formatDate } from '@/utils/formatDate';

const columns: DataTableColumnDef<Attribute>[] = [
  {
    accessorKey: 'name',
    cell: ({ row }) => <DataTableCell>{row.original.name}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'sortOrder',
    cell: ({ row }) => <DataTableCell>{row.original.sortOrder}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sort order" />
    ),
    meta: {
      align: 'right',
      wrap: 'nowrap',
    },
  },
  {
    accessorKey: 'createdAt',
    cell: ({ row }) => (
      <DataTableCell>{formatDate(row.original.createdAt)}</DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" />
    ),
    meta: {
      wrap: 'nowrap',
    },
  },
];

export const AtrributeDataTable = () => {
  const attributesQuery = useAttributesQuery();

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
    />
  );
};
