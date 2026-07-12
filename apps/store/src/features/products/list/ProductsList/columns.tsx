import type { Product } from '@/lib/domain/products';
import { formatDate } from '@/lib/utils/formatDate';
import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@/ui/index';

export const columns: DataTableColumnDef<Product>[] = [
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
    accessorKey: 'description',
    cell: ({ row }) => (
      <DataTableCell>{row.original.description}</DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    meta: {
      width: '38%',
      wrap: 'wrap',
    },
  },
  {
    accessorKey: 'category.name',
    cell: ({ row }) => (
      <DataTableCell>{row.original.category.name}</DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    meta: {
      width: '22%',
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
      width: '16%',
    },
  },
];
