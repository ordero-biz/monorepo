'use client';

import {
  Button,
  Card,
  DataTable,
  type DataTableColumnDef,
  DataTableColumnHeader,
  Typography,
} from '@ordero/ui';
import type { Attribute } from '@/lib/api/types';
import { useAttributesQuery } from '@/lib/hooks/useAttributesQuery';

const formatCreatedAt = (value: string) => {
  const createdAt = new Date(value);

  if (Number.isNaN(createdAt.getTime())) {
    return value;
  }

  const day = String(createdAt.getUTCDate()).padStart(2, '0');
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ][createdAt.getUTCMonth()];
  const year = createdAt.getUTCFullYear();

  return `${day} ${month} ${year}`;
};

const renderTextCell = (value: string | number) => (
  <div className="flex items-center py-[var(--spacing-2)]">
    <div className="px-[var(--spacing-2)]">
      <p className="text-card-foreground">{value}</p>
    </div>
  </div>
);

const columns: DataTableColumnDef<Attribute>[] = [
  {
    accessorKey: 'name',
    cell: ({ row }) => renderTextCell(row.original.name),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'sortOrder',
    cell: ({ row }) => renderTextCell(row.original.sortOrder),
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
    cell: ({ row }) => renderTextCell(formatCreatedAt(row.original.createdAt)),
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
