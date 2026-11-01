import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@ordero/ui';
import Link from 'next/link';
import { getCategoryDetailRoute } from '@/lib/client/routes';
import type { Category } from '@/lib/domain/categories/types';
import { formatDate } from '@/lib/utils/formatDate';
import { CategoryStatusChip } from '../../shared/CategoryStatusChip';

export const columns: DataTableColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    cell: ({ row }) => (
      <DataTableCell>
        <Link
          className="w-full font-600 rounded-[var(--radius-sm)] outline-none transition-colors hover:text-[var(--color-text-body)] hover:underline"
          href={getCategoryDetailRoute(row.original.id)}
        >
          {row.original.name}
        </Link>
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: {
      width: '60%',
    },
  },
  {
    accessorKey: 'status',
    cell: ({ row }) =>
      row.original.status ? (
        <DataTableCell>
          <CategoryStatusChip status={row.original.status} />
        </DataTableCell>
      ) : null,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: {
      width: '20%',
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
      width: '20%',
    },
  },
];
