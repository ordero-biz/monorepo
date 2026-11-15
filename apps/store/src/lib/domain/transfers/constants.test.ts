import { getTransferSourceWarehouseId } from './constants';

describe('getTransferSourceWarehouseId', () => {
  it.each([
    ['1', 1],
    [['5', '6'], 5],
    ['0', undefined],
    ['-3', undefined],
    ['1.5', undefined],
    ['abc', undefined],
    [undefined, undefined],
  ])('parses %j as %j', (value, expected) => {
    expect(getTransferSourceWarehouseId(value)).toBe(expected);
  });
});
