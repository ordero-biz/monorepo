import type { Supply } from '@/lib/domain/supplies';
import { formatDate } from '@/lib/utils/formatDate';
import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@/ui/index';

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

const formatSupplyStatus = (status: string) =>
  status
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const columns: DataTableColumnDef<Supply>[] = [
  {
    accessorKey: 'supplyNumber',
    cell: ({ row }) => (
      <DataTableCell>{row.original.supplyNumber}</DataTableCell>
    ),
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supply number" />
    ),
    meta: {
      width: '16%',
    },
  },
  {
    accessorFn: (row) => row.supplier.name,
    cell: ({ row }) => (
      <DataTableCell>{row.original.supplier.name}</DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
    id: 'supplier',
    meta: {
      width: '14%',
    },
  },
  {
    accessorFn: (row) => row.warehouse.name,
    cell: ({ row }) => (
      <DataTableCell>{row.original.warehouse.name}</DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Warehouse" />
    ),
    id: 'warehouse',
    meta: {
      width: '14%',
    },
  },
  {
    accessorKey: 'supplierInvoiceNumber',
    cell: ({ row }) => (
      <DataTableCell>{row.original.supplierInvoiceNumber ?? '-'}</DataTableCell>
    ),
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice number" />
    ),
    meta: {
      width: '16%',
      wrap: 'wrap',
    },
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => (
      <DataTableCell>{formatSupplyStatus(row.original.status)}</DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: {
      width: '8%',
    },
  },
  {
    accessorKey: 'totalPrice',
    cell: ({ row }) => (
      <DataTableCell>
        {numberFormatter.format(row.original.totalPrice)}
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total price" />
    ),
    meta: {
      align: 'right',
      width: '14%',
    },
  },
  {
    accessorKey: 'completedAt',
    cell: ({ row }) => (
      <DataTableCell>
        {row.original.completedAt ? formatDate(row.original.completedAt) : '-'}
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Completed at" />
    ),
    meta: {
      width: '18%',
    },
  },
];
