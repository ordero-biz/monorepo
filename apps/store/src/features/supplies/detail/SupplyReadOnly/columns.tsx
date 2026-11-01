import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
  Typography,
} from '@ordero/ui';
import { Package } from 'lucide-react';
import type { SupplyEntry } from '@/lib/domain/supplies/types';
import { formatMoney } from '@/lib/utils/formatMoney';

export const columns: DataTableColumnDef<SupplyEntry>[] = [
  {
    id: 'image',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: () => (
      <DataTableCell>
        <div
          aria-label="Product image unavailable"
          className="flex size-[var(--space-5)] items-center justify-center rounded-[var(--radius)] bg-[var(--background-neutral)] text-[var(--text-secondary)]"
          role="img"
        >
          <Package aria-hidden="true" className="size-[var(--space-3)]" />
        </div>
      </DataTableCell>
    ),
  },
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
