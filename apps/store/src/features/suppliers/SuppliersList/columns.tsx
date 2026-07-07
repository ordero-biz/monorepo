import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@ordero/ui';
import Link from 'next/link';
import { getSupplierDetailRoute } from '@/lib/client/routes';
import type { Supplier } from '@/lib/domain/suppliers';

export const columns: DataTableColumnDef<Supplier>[] = [
  {
    accessorKey: 'name',
    cell: ({ row }) => (
      <DataTableCell>
        <Link
          className="w-full font-600 rounded-[var(--radius-sm)] outline-none transition-colors hover:text-[var(--color-text-body)] hover:underline"
          href={getSupplierDetailRoute(row.original.id)}
        >
          {row.original.name}
        </Link>
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: {
      width: '18%',
    },
  },
  {
    accessorKey: 'email',
    cell: ({ row }) => <DataTableCell>{row.original.email}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    meta: {
      width: '22%',
    },
  },
  {
    accessorKey: 'phone',
    cell: ({ row }) => <DataTableCell>{row.original.phone}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    meta: {
      width: '16%',
    },
  },
  {
    accessorKey: 'address',
    cell: ({ row }) => <DataTableCell>{row.original.address}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    meta: {
      width: '24%',
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
      width: '20%',
      wrap: 'wrap',
    },
  },
];
