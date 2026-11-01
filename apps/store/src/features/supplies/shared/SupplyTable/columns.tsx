import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@ordero/ui';
import Link from 'next/link';
import { getSupplyDetailRoute } from '@/lib/client/routes';
import { formatDate } from '@/lib/utils/formatDate';
import { formatMoney } from '@/lib/utils/formatMoney';
import type { CreateSupplyColumnsArgs, SupplyTableRow } from './types';

export const createSupplyColumns = <T extends SupplyTableRow>({
  contextColumns = [],
}: CreateSupplyColumnsArgs<T> = {}): DataTableColumnDef<T>[] => [
  {
    accessorKey: 'supplyNumber',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supply number" />
    ),
    cell: ({ row }) => (
      <DataTableCell>
        <Link
          className="rounded-[var(--radius-sm)] font-600 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          href={getSupplyDetailRoute(row.original.id)}
        >
          {row.original.supplyNumber}
        </Link>
      </DataTableCell>
    ),
  },
  {
    accessorKey: 'supplier.name',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
    cell: ({ row }) => (
      <DataTableCell>{row.original.supplier.name}</DataTableCell>
    ),
  },
  ...contextColumns,
  {
    accessorKey: 'supplierInvoiceNumber',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice number" />
    ),
    cell: ({ row }) => (
      <DataTableCell>{row.original.supplierInvoiceNumber ?? '-'}</DataTableCell>
    ),
  },
  {
    accessorKey: 'totalPrice',
    enableSorting: false,
    meta: { align: 'left', wrap: 'nowrap' },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supply value" />
    ),
    cell: ({ row }) => (
      <DataTableCell>
        <span className="tabular-nums">
          {formatMoney(row.original.totalPrice)}
        </span>
      </DataTableCell>
    ),
  },
  {
    accessorKey: 'createdAt',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" />
    ),
    cell: ({ row }) => (
      <DataTableCell>{formatDate(row.original.createdAt)}</DataTableCell>
    ),
  },
];
