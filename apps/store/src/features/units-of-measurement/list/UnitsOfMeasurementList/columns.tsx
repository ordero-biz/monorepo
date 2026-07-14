import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@ordero/ui';
import Link from 'next/link';
import { getUnitOfMeasurementDetailRoute } from '@/lib/client/routes';
import type { UnitOfMeasurement } from '@/lib/domain/unitsOfMeasurement';

export const columns: DataTableColumnDef<UnitOfMeasurement>[] = [
  {
    accessorKey: 'name',
    cell: ({ row }) => (
      <DataTableCell>
        <Link
          className="w-full font-600 rounded-[var(--radius-sm)] outline-none transition-colors hover:text-[var(--color-text-body)] hover:underline"
          href={getUnitOfMeasurementDetailRoute(row.original.id)}
        >
          {row.original.name}
        </Link>
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: {
      width: '28%',
    },
  },
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
