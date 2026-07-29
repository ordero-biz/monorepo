import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@ordero/ui';
import Link from 'next/link';
import { getCategoryDetailRoute } from '@/lib/client/routes';
import type { Category } from '@/lib/domain/categories';
import { formatDate } from '@/lib/utils/formatDate';

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
      width: '70%',
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
      width: '30%',
    },
  },
];
