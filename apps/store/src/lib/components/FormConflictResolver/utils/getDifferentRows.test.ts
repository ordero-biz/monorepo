import { getDifferentRows } from './getDifferentRows';

type TestEntry = {
  clientId: string;
  productVariant: { id: number; name: string; sku: string };
  unitOfMeasurement: { id: number; name: string };
  quantity: string;
  unitPrice: string;
  comment: string;
};

const normalizeNumber = (value: string) => {
  const trimmed = value.trim();
  return trimmed !== '' && Number.isFinite(Number(trimmed))
    ? Number(trimmed)
    : trimmed;
};

const normalizeTestEntry = (entry: TestEntry) => ({
  productVariantId: entry.productVariant.id,
  unitOfMeasurementId: entry.unitOfMeasurement.id,
  quantity: normalizeNumber(entry.quantity),
  unitPrice: normalizeNumber(entry.unitPrice),
  comment: entry.comment.trim(),
});

const rice: TestEntry = {
  clientId: 'local-1',
  productVariant: { id: 1, name: 'Rice', sku: 'RICE' },
  unitOfMeasurement: { id: 2, name: 'Bag' },
  quantity: '2',
  unitPrice: '5',
  comment: '',
};

const compareRows = (
  entries: readonly TestEntry[],
  comparedEntries: readonly TestEntry[]
) =>
  getDifferentRows({
    entries,
    comparedEntries,
    normalizeEntry: normalizeTestEntry,
  });

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
    expect(compareRows([rice, other], [other, saved])).toEqual([false, false]);
  });

  it('counts duplicate occurrences without deduplicating products', () => {
    expect(compareRows([rice, rice, rice], [rice, rice])).toEqual([
      false,
      false,
      true,
    ]);
    expect(compareRows([rice], [rice, rice])).toEqual([false]);
    expect(compareRows([rice], [])).toEqual([true]);
    expect(compareRows([], [rice])).toEqual([]);
  });

  it.each([
    { quantity: '3' },
    { unitPrice: '6' },
    { comment: 'Separate delivery' },
    { unitOfMeasurement: { ...rice.unitOfMeasurement, id: 3 } },
    { productVariant: { ...rice.productVariant, id: 4 } },
  ])('marks differing persisted values without inferring row identity: %j', (change) => {
    expect(compareRows([{ ...rice, ...change }], [rice])).toEqual([true]);
  });

  it('keeps blank, zero and invalid unfinished values distinct', () => {
    const empty: TestEntry = {
      ...rice,
      clientId: 'new-row',
      quantity: '',
      unitPrice: '',
    };
    expect(
      compareRows(
        [{ ...empty, quantity: '0' }, { ...empty, quantity: 'invalid' }, empty],
        [empty]
      )
    ).toEqual([true, true, false]);
  });
});
