import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@ordero/ui';
import type { Warehouse } from '@/lib/domain/warehouses';

export const columns: DataTableColumnDef<Warehouse>[] = [
  {
    accessorKey: 'code',
    cell: ({ row }) => <DataTableCell>{row.original.code}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    meta: {
      width: '18%',
    },
  },
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
    accessorKey: 'address',
    cell: ({ row }) => <DataTableCell>{row.original.address}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    meta: {
      width: '34%',
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
      width: '24%',
      wrap: 'wrap',
    },
  },
];
