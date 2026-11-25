import { areFormValuesEqual } from './areFormValuesEqual';

describe('areFormValuesEqual', () => {
  it.each([
    { name: 'equal strings', left: 'text', right: 'text', equal: true },
    { name: 'different strings', left: 'before', right: 'after', equal: false },
    { name: 'untrimmed text', left: ' text ', right: 'text', equal: false },
    { name: 'numeric input types', left: '2', right: 2, equal: false },
    { name: 'boolean edits', left: true, right: false, equal: false },
    { name: 'empty selections', left: null, right: null, equal: true },
    {
      name: 'undefined values',
      left: undefined,
      right: undefined,
      equal: true,
    },
    {
      name: 'null versus undefined',
      left: null,
      right: undefined,
      equal: false,
    },
    { name: 'cleared values', left: 'text', right: '', equal: false },
  ])('compares $name without normalizing them', ({ left, right, equal }) => {
    expect(areFormValuesEqual(left, right)).toBe(equal);
    expect(areFormValuesEqual(right, left)).toBe(equal);
  });

  it('compares nested records by value regardless of object identity or property order', () => {
    expect(
      areFormValuesEqual(
        {
          name: 'Name',
          selection: { id: 1, name: 'Selected' },
          rows: [{ quantity: '2' }],
        },
        {
          rows: [{ quantity: '2' }],
          selection: { name: 'Selected', id: 1 },
          name: 'Name',
        }
      )
    ).toBe(true);
  });

  it('detects nested field edits and changed selection metadata', () => {
    const original = {
      selection: { id: 1, name: 'Before' },
      rows: [{ quantity: '2' }],
    };
    expect(
      areFormValuesEqual(original, { ...original, rows: [{ quantity: '3' }] })
    ).toBe(false);
    expect(
      areFormValuesEqual(original, {
        ...original,
        selection: { id: 1, name: 'After' },
      })
    ).toBe(false);
  });

  it('detects added, removed and reordered rows, including blank rows', () => {
    const rows = [{ quantity: '1' }, { quantity: '2' }];
    expect(areFormValuesEqual(rows, [...rows, { quantity: '' }])).toBe(false);
    expect(areFormValuesEqual(rows, rows.slice(1))).toBe(false);
    expect(areFormValuesEqual(rows, rows.toReversed())).toBe(false);
    expect(areFormValuesEqual([], [{ quantity: '' }])).toBe(false);
  });
});
