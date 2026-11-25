import type { SupplyEntryFormValues } from '../../../shared/SupplyEditorForm/types';

const normalizeNumber = (value: string) => {
  const trimmed = value.trim();
  return trimmed !== '' && Number.isFinite(Number(trimmed))
    ? Number(trimmed)
    : trimmed;
};

// Ignore UI ids and option metadata, but retain unfinished values.
export const normalizeSupplyEntry = (entry: SupplyEntryFormValues) => ({
  productVariantId: entry.productVariant?.id ?? null,
  unitOfMeasurementId: entry.unitOfMeasurement?.id ?? null,
  quantity: normalizeNumber(entry.quantity),
  unitPrice: normalizeNumber(entry.unitPrice),
  comment: entry.comment.trim(),
});
