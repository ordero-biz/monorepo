import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@ordero/ui';
import Link from 'next/link';
import { getTransferDetailRoute } from '@/lib/client/routes';
import { formatDate } from '@/lib/utils/formatDate';
import { TransferStatusChip } from '../TransferStatusChip';
import type { CreateTransferColumnsArgs, TransferTableRow } from './types';

export const createTransferColumns = <T extends TransferTableRow>({
  contextColumns = [],
}: CreateTransferColumnsArgs<T> = {}): DataTableColumnDef<T>[] => [
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
  ...contextColumns,
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
