import type { TransferDetails } from '@/lib/domain/transfers/types';
import type { TransferEntryFormValues } from '../types';
import {
  getStockItemKey,
  getTransferEntriesPayload,
  getTransferFormDefaults,
  hasOnlyBlankTransferEntry,
  isBlankTransferEntry,
} from './entries';

const stockItem = {
  productVariant: { id: 11, name: 'Rice', sku: 'GR-1', barcode: '' },
  unitOfMeasurement: { id: 4, name: 'Bag', symbol: 'bag' },
  available: 10,
};

const entry = (
  overrides: Partial<TransferEntryFormValues> = {}
): TransferEntryFormValues => ({
  clientId: 'row',
  stockItem: null,
  quantity: undefined,
  comment: '',
  ...overrides,
});

describe('transfer entry utils', () => {
  it('builds empty transfer defaults', () => {
    const defaults = getTransferFormDefaults();

    expect(defaults).toEqual({
      transferNumber: '',
      sourceWarehouse: null,
      destinationWarehouse: null,
      comment: '',
      transferEntries: [entry({ clientId: 'initial-placeholder' })],
    });
  });

  it('builds transfer defaults from a saved transfer', () => {
    const north = { id: 7, name: 'North', status: 'ACTIVE' } as const;
    const east = { id: 8, name: 'East', status: 'ACTIVE' } as const;

    expect(
      getTransferFormDefaults({
        id: 5,
        sourceWarehouse: north,
        destinationWarehouse: east,
        transferNumber: 'TR-5',
        status: 'DRAFT',
        comment: null,
        dispatchedAt: null,
        dispatchedBy: null,
        completedAt: null,
        completedBy: null,
        createdAt: '2026-11-17T10:00:00Z',
        createdBy: 'owner@example.test',
        updatedAt: '2026-11-17T10:00:00Z',
        updatedBy: 'owner@example.test',
        transferEntries: [
          {
            id: 17,
            productVariant: { id: 11, name: 'Rice', sku: 'GR-1', barcode: '' },
            unitOfMeasurement: {
              id: 4,
              name: 'Bag',
              symbol: 'bag',
              status: 'ACTIVE',
              comment: null,
            },
            quantity: 5,
            comment: null,
          },
        ],
        version: 1,
      } as TransferDetails)
    ).toEqual({
      transferNumber: 'TR-5',
      sourceWarehouse: north,
      destinationWarehouse: east,
      comment: '',
      transferEntries: [
        {
          clientId: 'existing-17',
          stockItem: {
            productVariant: { id: 11, name: 'Rice', sku: 'GR-1', barcode: '' },
            unitOfMeasurement: { id: 4, name: 'Bag', symbol: 'bag' },
          },
          quantity: 5,
          comment: '',
        },
      ],
    });
  });

  it('treats a row without product, quantity and comment as blank', () => {
    expect(isBlankTransferEntry(entry({ comment: '  ' }))).toBe(true);
    expect(isBlankTransferEntry(entry({ quantity: 1 }))).toBe(false);
    expect(isBlankTransferEntry(entry({ comment: 'Fragile' }))).toBe(false);
    expect(hasOnlyBlankTransferEntry([entry()])).toBe(true);
    expect(hasOnlyBlankTransferEntry([entry(), entry()])).toBe(false);
  });

  it('builds the payload from non-blank rows only', () => {
    expect(
      getTransferEntriesPayload({
        ...getTransferFormDefaults(),
        transferEntries: [
          entry({ stockItem, quantity: 4, comment: ' Fragile ' }),
          entry(),
          entry({ stockItem, quantity: 2, comment: '  ' }),
        ],
      })
    ).toEqual([
      {
        productVariantId: 11,
        unitOfMeasurementId: 4,
        quantity: 4,
        comment: 'Fragile',
      },
      { productVariantId: 11, unitOfMeasurementId: 4, quantity: 2 },
    ]);
  });

  it('keys stock lines by product variant and unit', () => {
    expect(getStockItemKey(stockItem)).toBe('11:4');
  });
});
