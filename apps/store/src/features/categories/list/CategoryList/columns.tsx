import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@ordero/ui';
import type { Category } from '@/lib/domain/categories';
import { formatDate } from '@/lib/utils/formatDate';

export const columns: DataTableColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    cell: ({ row }) => <DataTableCell>{row.original.name}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: {
      width: '40%',
    },
  },
  {
    accessorFn: (row) => row.parentCategory?.name ?? 'None',
    cell: ({ row }) => (
      <DataTableCell>
        {row.original.parentCategory?.name ?? 'None'}
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parent category" />
    ),
    id: 'parentCategory',
    meta: {
      width: '40%',
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
