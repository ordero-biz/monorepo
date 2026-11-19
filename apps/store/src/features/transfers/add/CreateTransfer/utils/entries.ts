import type {
  TransferEntryFormValues,
  TransferFormValues,
  TransferStockItemSelection,
} from '../types';

export const getTransferFormDefaults = (
  sourceWarehouse: TransferFormValues['sourceWarehouse'] = null
): TransferFormValues => ({
  transferNumber: '',
  sourceWarehouse,
  destinationWarehouse: null,
  comment: '',
  transferEntries: [createEmptyTransferEntry('initial-placeholder')],
});

export const createEmptyTransferEntry = (
  clientId: string
): TransferEntryFormValues => ({
  clientId,
  stockItem: null,
  quantity: undefined,
  comment: '',
});

export const isBlankTransferEntry = (entry: TransferEntryFormValues) =>
  !entry.stockItem && entry.quantity === undefined && !entry.comment.trim();

export const hasOnlyBlankTransferEntry = (
  entries: readonly TransferEntryFormValues[]
) => entries.length === 1 && isBlankTransferEntry(entries[0]);

export const getStockItemKey = (stockItem: TransferStockItemSelection) =>
  `${stockItem.productVariant.id}:${stockItem.unitOfMeasurement.id}`;

export const getUnitOfMeasurementLabel = (
  unit: TransferStockItemSelection['unitOfMeasurement']
) => (unit.symbol ? `${unit.name} (${unit.symbol})` : unit.name);

const isCompleteTransferEntry = (entry: TransferEntryFormValues) =>
  entry.stockItem !== null &&
  entry.quantity !== undefined &&
  Number.isInteger(entry.quantity) &&
  entry.quantity > 0 &&
  entry.quantity <= entry.stockItem.available;

export const getTransferSummary = (
  entries: readonly TransferEntryFormValues[]
): { count: number; units: number } => {
  const completeEntries = entries.filter(isCompleteTransferEntry);

  return {
    count: completeEntries.length,
    units: completeEntries.reduce(
      (total, entry) => total + (entry.quantity ?? 0),
      0
    ),
  };
};
