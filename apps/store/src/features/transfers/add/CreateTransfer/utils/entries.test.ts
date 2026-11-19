import type { TransferEntryFormValues } from '../types';
import {
  getStockItemKey,
  getTransferFormDefaults,
  getTransferSummary,
  hasOnlyBlankTransferEntry,
  isBlankTransferEntry,
} from './entries';

const stockItem = {
  productVariant: { id: 11, name: 'Rice', sku: 'GR-1' },
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
  it('builds transfer defaults with an optional source warehouse', () => {
    const defaults = getTransferFormDefaults();

    expect(defaults).toEqual({
      transferNumber: '',
      sourceWarehouse: null,
      destinationWarehouse: null,
      comment: '',
      transferEntries: [entry({ clientId: 'initial-placeholder' })],
    });

    const sourceWarehouse = { id: 7, name: 'North', status: 'ACTIVE' } as const;
    expect(getTransferFormDefaults(sourceWarehouse).sourceWarehouse).toBe(
      sourceWarehouse
    );
  });

  it('treats a row without product, quantity and comment as blank', () => {
    expect(isBlankTransferEntry(entry({ comment: '  ' }))).toBe(true);
    expect(isBlankTransferEntry(entry({ quantity: 1 }))).toBe(false);
    expect(isBlankTransferEntry(entry({ comment: 'Fragile' }))).toBe(false);
    expect(hasOnlyBlankTransferEntry([entry()])).toBe(true);
    expect(hasOnlyBlankTransferEntry([entry(), entry()])).toBe(false);
  });

  it('keys stock lines by product variant and unit', () => {
    expect(getStockItemKey(stockItem)).toBe('11:4');
  });

  it('sums only complete rows within the available stock', () => {
    expect(
      getTransferSummary([
        entry({ stockItem, quantity: 4 }),
        entry({ stockItem, quantity: 11 }),
        entry({ stockItem }),
        entry({ quantity: 3 }),
        entry({ stockItem, quantity: 6 }),
      ])
    ).toEqual({ count: 2, units: 10 });
  });
});
