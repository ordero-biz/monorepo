import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@ordero/ui';
import { ProductExtendedTableCell } from '@/lib/components/TableCell';
import type { TransferEntry } from '@/lib/domain/transfers/types';

export const columns: DataTableColumnDef<TransferEntry>[] = [
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
    id: 'barcode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Barcode" />
    ),
    cell: ({ row }) => (
      <DataTableCell>
        {row.original.productVariant.barcode || '-'}
      </DataTableCell>
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
    cell: ({ row }) => (
      <DataTableCell>
        {row.original.quantity.toLocaleString('en-US')}
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
