import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@ordero/ui';
import Link from 'next/link';
import { getTransferDetailRoute } from '@/lib/client/routes';
import type { Transfer } from '@/lib/domain/transfers/types';
import { formatDate } from '@/lib/utils/formatDate';
import { TransferStatusChip } from '../../shared/TransferStatusChip';

export const columns: DataTableColumnDef<Transfer>[] = [
  {
    accessorKey: 'transferNumber',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transfer number" />
    ),
    cell: ({ row }) => (
      <DataTableCell>
        <Link
          className="rounded-[var(--radius-sm)] font-600 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          href={getTransferDetailRoute(row.original.id)}
        >
          {row.original.transferNumber}
        </Link>
      </DataTableCell>
    ),
  },
  {
    accessorKey: 'sourceWarehouse.name',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="From warehouse" />
    ),
    cell: ({ row }) => (
      <DataTableCell>{row.original.sourceWarehouse.name}</DataTableCell>
    ),
  },
  {
    accessorKey: 'destinationWarehouse.name',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="To warehouse" />
    ),
    cell: ({ row }) => (
      <DataTableCell>{row.original.destinationWarehouse.name}</DataTableCell>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <DataTableCell>
        <TransferStatusChip status={row.original.status} />
      </DataTableCell>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" />
    ),
    cell: ({ row }) => (
      <DataTableCell>{formatDate(row.original.createdAt)}</DataTableCell>
    ),
  },
];
