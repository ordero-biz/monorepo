import { createEmptySupplyEntry } from '../utils';
import { mapSupplyFieldErrors } from './mapSupplyFieldErrors';

describe('mapSupplyFieldErrors', () => {
  it.each([
    ['quantity', 'quantity'],
    ['unitPrice', 'unitPrice'],
    ['comment', 'comment'],
    ['productVariantId', 'productVariant'],
    ['unitOfMeasurementId', 'unitOfMeasurement'],
  ])('maps dotted and bracketed %s errors past omitted rows', (backendField, formField) => {
    expect(
      mapSupplyFieldErrors({
        fieldErrors: {
          [`supplyEntries.0.${backendField}`]: 'First submitted row error',
          [`supplyEntries[1].${backendField}`]: 'Second submitted row error',
        },
        submittedEntryIds: ['first', 'second'],
        currentEntries: [
          createEmptySupplyEntry('blank-before'),
          createEmptySupplyEntry('first'),
          createEmptySupplyEntry('blank-between'),
          createEmptySupplyEntry('second'),
          createEmptySupplyEntry('blank-after'),
        ],
      })
    ).toEqual({
      [`supplyEntries[1].${formField}`]: 'First submitted row error',
      [`supplyEntries[3].${formField}`]: 'Second submitted row error',
    });
  });

  it('uses row identity when current rows have moved', () => {
    expect(
      mapSupplyFieldErrors({
        fieldErrors: {
          'supplyEntries[0].quantity': 'First row error',
          'supplyEntries.1.unitPrice': 'Second row error',
        },
        submittedEntryIds: ['first', 'second'],
        currentEntries: [
          createEmptySupplyEntry('second'),
          createEmptySupplyEntry('first'),
        ],
      })
    ).toEqual({
      'supplyEntries[1].quantity': 'First row error',
      'supplyEntries[0].unitPrice': 'Second row error',
    });
  });

  it('does not attach errors for removed or unknown submitted rows to remaining rows', () => {
    expect(
      mapSupplyFieldErrors({
        fieldErrors: {
          'supplyEntries[0].quantity': 'Removed row error',
          'supplyEntries[1].quantity': 'Remaining row error',
          'supplyEntries[2].quantity': 'Unknown row error',
        },
        submittedEntryIds: ['removed', 'remaining'],
        currentEntries: [
          createEmptySupplyEntry('remaining'),
          createEmptySupplyEntry('new'),
        ],
      })
    ).toEqual({ 'supplyEntries[0].quantity': 'Remaining row error' });
  });

  it('preserves supply and collection errors and maps top-level selection IDs', () => {
    expect(
      mapSupplyFieldErrors({
        fieldErrors: {
          supplierId: 'Supplier error',
          warehouseId: 'Warehouse error',
          supplyNumber: 'Number error',
          supplierInvoiceNumber: 'Invoice error',
          comment: 'Comment error',
          supplyEntries: 'Collection error',
          'supplyEntries.0': 'Row error',
        },
        submittedEntryIds: ['row'],
        currentEntries: [
          createEmptySupplyEntry('blank'),
          createEmptySupplyEntry('row'),
        ],
      })
    ).toEqual({
      supplier: 'Supplier error',
      warehouse: 'Warehouse error',
      supplyNumber: 'Number error',
      supplierInvoiceNumber: 'Invoice error',
      comment: 'Comment error',
      supplyEntries: 'Collection error',
      'supplyEntries[1]': 'Row error',
    });
  });

  it('returns no field errors when the backend provides none', () => {
    expect(
      mapSupplyFieldErrors({ submittedEntryIds: [], currentEntries: [] })
    ).toEqual({});
  });
});
