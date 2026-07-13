import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@ordero/ui';
import Link from 'next/link';
import { getWarehouseDetailRoute } from '@/lib/client/routes';
import type { Warehouse } from '@/lib/domain/warehouses';

export const columns: DataTableColumnDef<Warehouse>[] = [
  {
    accessorKey: 'code',
    cell: ({ row }) => (
      <DataTableCell>
        <Link
          className="w-full font-600 rounded-[var(--radius-sm)] outline-none transition-colors hover:text-[var(--color-text-body)] hover:underline"
          href={getWarehouseDetailRoute(row.original.id)}
        >
          {row.original.code}
        </Link>
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    meta: {
      width: '18%',
    },
  },
  {
    accessorKey: 'name',
    cell: ({ row }) => <DataTableCell>{row.original.name}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: {
      width: '24%',
    },
  },
  {
    accessorKey: 'address',
    cell: ({ row }) => <DataTableCell>{row.original.address}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    meta: {
      width: '34%',
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
      width: '24%',
      wrap: 'wrap',
    },
  },
];
