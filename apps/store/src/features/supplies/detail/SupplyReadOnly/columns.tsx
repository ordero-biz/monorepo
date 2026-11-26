import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@ordero/ui';
import { ProductExtendedTableCell } from '@/lib/components/TableCell';
import type { SupplyEntry } from '@/lib/domain/supplies/types';
import { formatMoney } from '@/lib/utils/formatMoney';

export const columns: DataTableColumnDef<SupplyEntry>[] = [
  {
    id: 'product',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => (
      <ProductExtendedTableCell
        name={row.original.productVariant.name}
        sku={row.original.productVariant.sku}
      />
    ),
  },
  {
    id: 'unit',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unit" />
    ),
    cell: ({ row }) => (
      <DataTableCell>
        {row.original.unitOfMeasurement.name}
        {row.original.unitOfMeasurement.symbol
          ? ` (${row.original.unitOfMeasurement.symbol})`
          : ''}
      </DataTableCell>
    ),
  },
  {
    id: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => <DataTableCell>{row.original.quantity}</DataTableCell>,
  },
  {
    id: 'unitPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unit price" />
    ),
    cell: ({ row }) => (
      <DataTableCell>{formatMoney(row.original.unitPrice)}</DataTableCell>
    ),
  },
  {
    id: 'total',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => (
      <DataTableCell>
        {formatMoney(row.original.quantity * row.original.unitPrice)}
      </DataTableCell>
    ),
  },
  {
    id: 'comment',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comment" />
    ),
    cell: ({ row }) => (
      <DataTableCell>{row.original.comment || '-'}</DataTableCell>
    ),
  },
];
