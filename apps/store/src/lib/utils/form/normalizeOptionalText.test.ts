import { normalizeOptionalText } from './normalizeOptionalText';

describe('normalizeOptionalText', () => {
  it.each([
    [' Fragile ', 'Fragile'],
    ['   ', null],
    ['', null],
    [null, null],
    [undefined, null],
  ])('normalizes %j to %j', (value, expected) => {
    expect(normalizeOptionalText(value)).toBe(expected);
  });
});
