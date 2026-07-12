import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@ordero/ui';
import type { UnitOfMeasurement } from '@/lib/domain/unitsOfMeasurement';

export const columns: DataTableColumnDef<UnitOfMeasurement>[] = [
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
      width: '28%',
    },
  },
  {
    accessorKey: 'symbol',
    cell: ({ row }) => <DataTableCell>{row.original.symbol}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Symbol" />
    ),
    meta: {
      width: '18%',
    },
  },
  {
    accessorKey: 'comment',
    cell: ({ row }) => <DataTableCell>{row.original.comment}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comment" />
    ),
    meta: {
      width: '36%',
      wrap: 'wrap',
    },
  },
];
