import type { SupplyEntryFormValues } from '../../../../shared/SupplyEditorForm/types';
import { createEmptySupplyEntry } from '../../../../shared/SupplyEditorForm/utils';
import { getDifferentRows } from './getDifferentRows';

const rice = {
  clientId: 'local-1',
  productVariant: { id: 1, name: 'Rice', sku: 'RICE' },
  unitOfMeasurement: { id: 2, name: 'Bag', symbol: 'bag', status: 'ACTIVE' },
  quantity: '2',
  unitPrice: '5',
  comment: '',
} satisfies SupplyEntryFormValues;

describe('getDifferentRows', () => {
  it('matches values despite new ids, reordering, display metadata and numeric formatting', () => {
    const other = { ...rice, quantity: '8' };
    const saved = {
      ...rice,
      clientId: 'saved-9',
      quantity: ' 02 ',
      unitPrice: '5.00',
      comment: ' ',
      productVariant: { ...rice.productVariant, name: 'Renamed rice' },
    };
    expect(getDifferentRows([rice, other], [other, saved])).toEqual([
      false,
      false,
    ]);
  });

  it('counts duplicate occurrences without deduplicating products', () => {
    expect(getDifferentRows([rice, rice, rice], [rice, rice])).toEqual([
      false,
      false,
      true,
    ]);
    expect(getDifferentRows([rice], [rice, rice])).toEqual([false]);
    expect(getDifferentRows([rice], [])).toEqual([true]);
    expect(getDifferentRows([], [rice])).toEqual([]);
  });

  it.each([
    { quantity: '3' },
    { unitPrice: '6' },
    { comment: 'Separate delivery' },
    { unitOfMeasurement: { ...rice.unitOfMeasurement, id: 3 } },
    { productVariant: { ...rice.productVariant, id: 4 } },
  ])('marks differing persisted values without inferring row identity: %j', (change) => {
    expect(getDifferentRows([{ ...rice, ...change }], [rice])).toEqual([true]);
  });

  it('keeps blank, zero and invalid unfinished values distinct', () => {
    const empty = createEmptySupplyEntry('new-row');
    expect(
      getDifferentRows(
        [{ ...empty, quantity: '0' }, { ...empty, quantity: 'invalid' }, empty],
        [empty]
      )
    ).toEqual([true, true, false]);
  });
});
