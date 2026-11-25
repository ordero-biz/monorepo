import type { DataTableColumnDef } from '@ordero/ui';
import { getUnitOfMeasurementLabel } from '../../../shared/TransferEditorForm/utils/entries';
import type { TransferProductPreviewRow } from './types';

export const columns: DataTableColumnDef<TransferProductPreviewRow>[] = [
  {
    id: 'product',
    header: () => <div className="p-[var(--space-1)]">Product / SKU</div>,
    meta: { width: 104, wrap: 'wrap' },
    cell: ({ row: { original: entry } }) => (
      <div className="max-w-48 p-[var(--space-1)] whitespace-normal wrap-break-word">
        <p>{entry.stockItem?.productVariant.name || 'No product selected'}</p>
        {entry.stockItem?.productVariant.sku && (
          <p className="text-muted-foreground">
            {entry.stockItem.productVariant.sku}
          </p>
        )}
        {entry.source && (
          <p className="font-[var(--subtitle2-weight)]">{entry.source}</p>
        )}
        {entry.different && (
          <p className="font-[var(--subtitle2-weight)] text-[var(--text-primary)]">
            Different
          </p>
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
    cell: ({ row: { original: entry } }) => (
      <div className="p-[var(--space-1)] tabular-nums">
        {entry.quantity ?? 'Not entered'}{' '}
        <span className="block text-muted-foreground">
          {entry.stockItem
            ? getUnitOfMeasurementLabel(entry.stockItem.unitOfMeasurement)
            : 'Not selected'}
        </span>
      </div>
    ),
  },
];
