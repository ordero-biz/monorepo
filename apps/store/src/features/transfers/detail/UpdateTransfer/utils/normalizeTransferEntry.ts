import type { TransferEntryFormValues } from '../../../shared/TransferEditorForm/types';

// Ignore UI ids, stock snapshots, and option metadata, but retain unfinished values.
export const normalizeTransferEntry = (entry: TransferEntryFormValues) => ({
  productVariantId: entry.stockItem?.productVariant.id ?? null,
  unitOfMeasurementId: entry.stockItem?.unitOfMeasurement.id ?? null,
  quantity: entry.quantity ?? null,
  comment: entry.comment.trim(),
});
