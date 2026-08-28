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
      width: '25%',
    },
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => (
      <DataTableCell>
        <CategoryStatusChip status={row.original.status} />
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: {
      width: '15%',
    },
  },
  {
    accessorFn: (row) => row.parentCategory?.name ?? 'None',
    cell: ({ row }) => (
      <DataTableCell>
        {row.original.parentCategory ? (
          <Link
            className="w-full rounded-[var(--radius-sm)] outline-none transition-colors hover:text-[var(--color-text-body)] hover:underline"
            href={getCategoryDetailRoute(row.original.parentCategory.id)}
          >
            {row.original.parentCategory.name}
          </Link>
        ) : (
          'None'
        )}
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parent category" />
    ),
    id: 'parentCategory',
    meta: {
      width: '25%',
    },
  },
  {
    accessorFn: (row) => row.parentCategory?.status ?? '',
    cell: ({ row }) => (
      <DataTableCell>
        <CategoryStatusChip status={row.original.parentCategory?.status} />
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parent status" />
    ),
    id: 'parentStatus',
    meta: {
      width: '15%',
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
