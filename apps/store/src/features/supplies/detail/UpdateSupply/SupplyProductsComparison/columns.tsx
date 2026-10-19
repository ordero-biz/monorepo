import type { DataTableColumnDef } from '@ordero/ui';
import { formatMoney } from '../../../shared/formatMoney';
import type { SupplyProductPreviewRow } from './types';

export const columns: DataTableColumnDef<SupplyProductPreviewRow>[] = [
  {
    id: 'product',
    header: () => <div className="p-[var(--space-1)]">Product / SKU</div>,
    meta: { width: 104, wrap: 'wrap' },
    cell: ({ row: { original: entry } }) => (
      <div className="max-w-48 p-[var(--space-1)] whitespace-normal wrap-break-word">
        <p>{entry.productVariant?.name || 'No product selected'}</p>
        {entry.productVariant?.sku && (
          <p className="text-muted-foreground">{entry.productVariant.sku}</p>
        )}
        {entry.source && (
          <p className="font-[var(--subtitle2-weight)]">{entry.source}</p>
        )}
        {entry.comment.trim() && (
          <details className="mt-[var(--space-0-5)]">
            <summary className="cursor-pointer text-muted-foreground">
              Comment
            </summary>
            <p className="whitespace-pre-wrap">{entry.comment}</p>
          </details>
        )}
      </div>
    ),
  },
  {
    id: 'quantity',
    header: () => <div className="p-[var(--space-1)]">Quantity / unit</div>,
    meta: { align: 'right', width: 88 },
    cell: ({ row }) => (
      <div className="p-[var(--space-1)] tabular-nums">
        {row.original.quantity.trim() || 'Not entered'}{' '}
        <span className="block text-muted-foreground">
          {row.original.unitOfMeasurement?.name || 'Not selected'}
          {row.original.unitOfMeasurement?.symbol
            ? ` (${row.original.unitOfMeasurement.symbol})`
            : ''}
        </span>
      </div>
    ),
  },
  {
    id: 'unitPrice',
    header: () => <div className="p-[var(--space-1)]">Unit price</div>,
    meta: { align: 'right', width: 80 },
    cell: ({ row }) => {
      const price = row.original.unitPrice.trim();
      return (
        <div className="p-[var(--space-1)] tabular-nums">
          {price === ''
            ? 'Not entered'
            : Number.isFinite(Number(price))
              ? formatMoney(Number(price))
              : price}
        </div>
      );
    },
  },
];
