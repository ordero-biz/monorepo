import Link from 'next/link';
import { getSupplierDetailRoute } from '@/lib/client/routes';
import type { Supplier } from '@/lib/domain/suppliers';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers';
import {
  Chip,
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@/ui/index';

const statusLabels = {
  [SUPPLIER_STATUS.ACTIVE]: 'Active',
  [SUPPLIER_STATUS.DRAFT]: 'Draft',
} as const;

const getStatusChip = (status: Supplier['status']) => (
  <Chip
    color={status === SUPPLIER_STATUS.ACTIVE ? 'primary' : 'warning'}
    size="s"
    variant="soft"
  >
    {statusLabels[status]}
  </Chip>
);

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
    accessorKey: 'status',
    cell: ({ row }) => (
      <DataTableCell>{getStatusChip(row.original.status)}</DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: {
      width: '12%',
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
