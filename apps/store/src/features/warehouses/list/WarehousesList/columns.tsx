import {
  Chip,
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@ordero/ui';
import Link from 'next/link';
import { getWarehouseDetailRoute } from '@/lib/client/routes';
import { WAREHOUSE_STATUS, type Warehouse } from '@/lib/domain/warehouses';

const statusLabels = {
  ACTIVE: 'Active',
  DRAFT: 'Draft',
} as const;

const getStatusChip = (status?: Warehouse['status']) => {
  if (!status) {
    return null;
  }

  return (
    <Chip
      color={status === WAREHOUSE_STATUS.ACTIVE ? 'primary' : 'warning'}
      size="s"
      variant="soft"
    >
      {statusLabels[status]}
    </Chip>
  );
};

export const columns: DataTableColumnDef<Warehouse>[] = [
  {
    accessorKey: 'name',
    cell: ({ row }) => (
      <DataTableCell>
        <Link
          className="w-full font-600 rounded-[var(--radius-sm)] outline-none transition-colors hover:text-[var(--color-text-body)] hover:underline"
          href={getWarehouseDetailRoute(row.original.id)}
        >
          {row.original.name}
        </Link>
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: {
      width: '25%',
    },
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => (
      <DataTableCell>{getStatusChip(row.original.status)}</DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: {
      width: '15%',
    },
  },
  {
    accessorKey: 'address',
    cell: ({ row }) => <DataTableCell>{row.original.address}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    meta: {
      width: '35%',
      wrap: 'wrap',
    },
  },
  {
    accessorKey: 'comment',
    cell: ({ row }) => <DataTableCell>{row.original.comment}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comment" />
    ),
    meta: {
      width: '25%',
      wrap: 'wrap',
    },
  },
];
