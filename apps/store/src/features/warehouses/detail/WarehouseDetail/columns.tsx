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
    meta: { align: 'right', wrap: 'nowrap' },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => (
      <DataTableCell>
        <span className="tabular-nums">{row.original.quantity}</span>
      </DataTableCell>
    ),
  },
  {
    id: 'total',
    meta: { align: 'right', wrap: 'nowrap' },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock value" />
    ),
    cell: ({ row }) => (
      <DataTableCell>
        <span className="tabular-nums">
          {formatMoney(row.original.totalPrice)}
        </span>
      </DataTableCell>
    ),
  },
];
