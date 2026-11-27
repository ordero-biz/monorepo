import type { TransferEntryData } from '@/lib/client/api/transfers';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import type {
  TransferEntryFormValues,
  TransferFormValues,
  TransferStockItemSelection,
} from '../types';

/** Saved rows have no known `available` until the stock line is re-picked. */
export const getTransferFormDefaults = (
  initialTransfer?: TransferDetails
): TransferFormValues => ({
  transferNumber: initialTransfer?.transferNumber ?? '',
  sourceWarehouse: initialTransfer
    ? {
        id: initialTransfer.sourceWarehouse.id,
        name: initialTransfer.sourceWarehouse.name,
        status: initialTransfer.sourceWarehouse.status,
      }
    : null,
  destinationWarehouse: initialTransfer
    ? {
        id: initialTransfer.destinationWarehouse.id,
        name: initialTransfer.destinationWarehouse.name,
        status: initialTransfer.destinationWarehouse.status,
      }
    : null,
  comment: initialTransfer?.comment ?? '',
  transferEntries: initialTransfer?.transferEntries.length
    ? initialTransfer.transferEntries.map((entry) => ({
        clientId: `existing-${entry.id}`,
        stockItem: {
          productVariant: {
            id: entry.productVariant.id,
            name: entry.productVariant.name,
            sku: entry.productVariant.sku,
            barcode: entry.productVariant.barcode,
          },
          unitOfMeasurement: {
            id: entry.unitOfMeasurement.id,
            name: entry.unitOfMeasurement.name,
            symbol: entry.unitOfMeasurement.symbol,
          },
        },
        quantity: entry.quantity,
        comment: entry.comment ?? '',
      }))
    : [createEmptyTransferEntry('initial-placeholder')],
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

export const getTransferEntriesPayload = (
  value: TransferFormValues
): TransferEntryData[] =>
  value.transferEntries
    .filter((entry) => !isBlankTransferEntry(entry))
    .map((entry) => {
      const comment = entry.comment.trim();

      return {
        productVariantId: Number(entry.stockItem?.productVariant.id),
        unitOfMeasurementId: Number(entry.stockItem?.unitOfMeasurement.id),
        quantity: Number(entry.quantity),
        ...(comment ? { comment } : {}),
      };
    });

export const getStockItemKey = (stockItem: TransferStockItemSelection) =>
  `${stockItem.productVariant.id}:${stockItem.unitOfMeasurement.id}`;

export const getUnitOfMeasurementLabel = (
  unit: TransferStockItemSelection['unitOfMeasurement']
) => (unit.symbol ? `${unit.name} (${unit.symbol})` : unit.name);
