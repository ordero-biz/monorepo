import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import {
  validateTransferDestinationWarehouse,
  validateTransferEntryField,
  validateTransferNumber,
  validateTransferSourceWarehouse,
} from './validations';

const mainWarehouse = {
  id: 1,
  name: 'Main Warehouse',
  status: WAREHOUSE_STATUS.ACTIVE,
};
const eastWarehouse = {
  id: 2,
  name: 'East Warehouse',
  status: WAREHOUSE_STATUS.ACTIVE,
};

describe('transfer validations', () => {
  it('requires a name up to 100 characters', () => {
    expect(validateTransferNumber({ value: '  ' })).toBe('Name is required');
    expect(validateTransferNumber({ value: 'a'.repeat(101) })).toBe(
      'Name must be 100 characters or less'
    );
    expect(validateTransferNumber({ value: 'Weekend restock' })).toBe(
      undefined
    );
  });

  it('requires a source warehouse', () => {
    expect(validateTransferSourceWarehouse({ value: null })).toBe(
      'Select a source warehouse'
    );
    expect(validateTransferSourceWarehouse({ value: mainWarehouse })).toBe(
      undefined
    );
  });

  it('requires a destination different from the source', () => {
    expect(
      validateTransferDestinationWarehouse({
        value: null,
        sourceWarehouse: mainWarehouse,
      })
    ).toBe('Select a destination warehouse');
    expect(
      validateTransferDestinationWarehouse({
        value: mainWarehouse,
        sourceWarehouse: mainWarehouse,
      })
    ).toBe('Destination must differ from the source warehouse');
    expect(
      validateTransferDestinationWarehouse({
        value: eastWarehouse,
        sourceWarehouse: mainWarehouse,
      })
    ).toBe(undefined);
  });

  describe('entries', () => {
    const entry = {
      clientId: 'row',
      stockItem: {
        productVariant: { id: 11, name: 'Rice', sku: 'GR-1', barcode: '' },
        unitOfMeasurement: { id: 4, name: 'Bag', symbol: 'bag' },
        available: 10,
      },
      quantity: 3 as number | undefined,
      comment: '',
    };

    it('skips the empty placeholder row', () => {
      const blank = { ...entry, stockItem: null, quantity: undefined };
      expect(
        validateTransferEntryField({ value: blank, field: 'stockItem' })
      ).toBe(undefined);
      expect(
        validateTransferEntryField({ value: blank, field: 'quantity' })
      ).toBe(undefined);
    });

    it('requires a product once the row has data', () => {
      expect(
        validateTransferEntryField({
          value: { ...entry, stockItem: null },
          field: 'stockItem',
        })
      ).toBe('Select a product');
    });

    it.each([
      [undefined, 'Quantity is required'],
      [0, 'Quantity must be a whole number greater than 0'],
      [1.5, 'Quantity must be a whole number greater than 0'],
      [11, 'Only 10 available'],
      [10, undefined],
    ])('validates quantity %j', (quantity, expected) => {
      expect(
        validateTransferEntryField({
          value: { ...entry, quantity },
          field: 'quantity',
        })
      ).toBe(expected);
    });
  });
});
