import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@ordero/ui';
import Link from 'next/link';
import { getAttributeDetailRoute } from '@/lib/client/routes';
import { formatDate } from '@/utils/formatDate';
import type { Attribute } from '../types';

export const columns: DataTableColumnDef<Attribute>[] = [
  {
    accessorKey: 'name',
    cell: ({ row }) => (
      <DataTableCell>
        <Link
          className="inline-flex max-w-full rounded-[var(--radius-sm)] text-[var(--primary-dark)] outline-none transition-colors hover:text-[var(--primary-darker)] hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          href={getAttributeDetailRoute(row.original.id)}
        >
          {row.original.name}
        </Link>
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: {
      width: '50%',
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
      width: '50%',
    },
  },
];
