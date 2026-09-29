import type { Supply } from '@/lib/domain/supplies/types';
import { formatDate } from '@/lib/utils/formatDate';
import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@/ui/index';
import { SupplyStatusChip } from '../../shared/SupplyStatusChip';

const renderOptionalValue = (value?: string | null) => value || '-';

export const columns: DataTableColumnDef<Supply>[] = [
  {
    accessorKey: 'supplyNumber',
    cell: ({ row }) => (
      <DataTableCell>
        {renderOptionalValue(row.original.supplyNumber)}
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supply number" />
    ),
    meta: { width: '14%' },
  },
  {
    accessorKey: 'supplier.name',
    cell: ({ row }) => (
      <DataTableCell>{row.original.supplier.name}</DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
    meta: { width: '15%' },
  },
  {
    accessorKey: 'warehouse.name',
    cell: ({ row }) => (
      <DataTableCell>{row.original.warehouse.name}</DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Warehouse" />
    ),
    meta: { width: '15%' },
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => (
      <DataTableCell>
        <SupplyStatusChip status={row.original.status} />
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: { width: '11%' },
  },
  {
    accessorKey: 'supplierInvoiceNumber',
    cell: ({ row }) => (
      <DataTableCell>
        {renderOptionalValue(row.original.supplierInvoiceNumber)}
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice number" />
    ),
    meta: { width: '14%' },
  },
  {
    accessorKey: 'totalQuantity',
    cell: ({ row }) => (
      <DataTableCell>{row.original.totalQuantity}</DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    meta: { align: 'right', width: '9%' },
  },
  {
    accessorKey: 'totalPrice',
    cell: ({ row }) => <DataTableCell>{row.original.totalPrice}</DataTableCell>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total price" />
    ),
    meta: { align: 'right', width: '10%' },
  },
  {
    accessorKey: 'createdAt',
    cell: ({ row }) => (
      <DataTableCell>
        {row.original.createdAt ? formatDate(row.original.createdAt) : '-'}
      </DataTableCell>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" />
    ),
    meta: { width: '12%' },
  },
];
