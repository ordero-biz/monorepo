import type { SupplyEntryFormValues } from '../../../shared/SupplyEditorForm/types';
import { normalizeSupplyEntry } from './normalizeSupplyEntry';

const entry = {
  clientId: 'local-1',
  productVariant: { id: 1, name: 'Rice', sku: 'RICE' },
  unitOfMeasurement: { id: 2, name: 'Bag', symbol: 'bag', status: 'ACTIVE' },
  quantity: ' 02 ',
  unitPrice: '5.00',
  comment: '  Deliver before noon  ',
} satisfies SupplyEntryFormValues;

describe('normalizeSupplyEntry', () => {
  it('retains persisted values without UI identity or option metadata', () => {
    expect(normalizeSupplyEntry(entry)).toEqual({
      productVariantId: 1,
      unitOfMeasurementId: 2,
      quantity: 2,
      unitPrice: 5,
      comment: 'Deliver before noon',
    });
    expect(
      normalizeSupplyEntry({
        ...entry,
        clientId: 'saved-9',
        productVariant: { id: 1, name: 'Renamed rice', sku: 'NEW-RICE' },
        unitOfMeasurement: {
          id: 2,
          name: 'Renamed bag',
          symbol: 'bg',
          status: 'DRAFT',
        },
      })
    ).toEqual(normalizeSupplyEntry(entry));
  });

  it('retains missing selections and unfinished fields', () => {
    expect(
      normalizeSupplyEntry({
        ...entry,
        productVariant: null,
        unitOfMeasurement: null,
        quantity: '',
        unitPrice: ' ',
        comment: '\t\n',
      })
    ).toEqual({
      productVariantId: null,
      unitOfMeasurementId: null,
      quantity: '',
      unitPrice: '',
      comment: '',
    });
  });

  it.each([
    [' 02 ', 2],
    ['5.00', 5],
    [' 0 ', 0],
    ['-3.5', -3.5],
    ['', ''],
    [' \t ', ''],
    [' invalid ', 'invalid'],
    [' 1.2.3 ', '1.2.3'],
    [' NaN ', 'NaN'],
    [' Infinity ', 'Infinity'],
    [' -Infinity ', '-Infinity'],
    ['1e309', '1e309'],
  ])('normalizes quantity and price %j to %j without discarding unfinished input', (value, expected) => {
    expect(
      normalizeSupplyEntry({
        ...entry,
        quantity: String(value),
        unitPrice: String(value),
      })
    ).toMatchObject({ quantity: expected, unitPrice: expected });
  });

  it('preserves meaningful whitespace inside comments', () => {
    expect(
      normalizeSupplyEntry({
        ...entry,
        comment: '  First line\nSecond  line\t ',
      }).comment
    ).toBe('First line\nSecond  line');
  });

  it('does not modify the original form values', () => {
    const original = structuredClone(entry);
    normalizeSupplyEntry(original);
    expect(original).toEqual(entry);
  });
});
