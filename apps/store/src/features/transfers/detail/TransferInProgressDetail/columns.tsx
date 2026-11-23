import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
  Typography,
} from '@ordero/ui';
import { Package } from 'lucide-react';
import type { TransferEntry } from '@/lib/domain/transfers/types';

export const columns: DataTableColumnDef<TransferEntry>[] = [
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
          {row.original.productVariant.sku ? (
            <Typography variant="body2">
              {row.original.productVariant.sku}
            </Typography>
          ) : null}
          <Typography
            color={
              row.original.productVariant.sku
                ? 'text-secondary'
                : 'text-primary'
            }
            variant="body2"
          >
            {row.original.productVariant.name}
          </Typography>
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
