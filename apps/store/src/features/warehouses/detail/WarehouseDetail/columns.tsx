import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
  Typography,
} from '@ordero/ui';
import type { WarehouseStockItem } from '@/lib/domain/warehouses/types';
import { formatMoney } from '@/lib/utils/formatMoney';

export const columns: DataTableColumnDef<WarehouseStockItem>[] = [
  {
    id: 'product',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => (
      <DataTableCell>
        <div className="flex flex-col gap-[var(--space-0-5)]">
          <Typography variant="body2">
            {row.original.productVariant.name}
          </Typography>
          {row.original.productVariant.sku ? (
            <Typography color="text-secondary" variant="body2">
              {row.original.productVariant.sku}
            </Typography>
          ) : null}
        </div>
      </DataTableCell>
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
    cell: ({ row }) => <DataTableCell>{row.original.quantity}</DataTableCell>,
  },
  {
    id: 'total',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total price" />
    ),
    cell: ({ row }) => (
      <DataTableCell>{formatMoney(row.original.totalPrice)}</DataTableCell>
    ),
  },
];
