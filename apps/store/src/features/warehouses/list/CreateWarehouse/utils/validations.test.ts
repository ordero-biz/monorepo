import {
  createWarehouseSchema,
  validateWarehouseAddress,
  validateWarehouseCode,
  validateWarehouseName,
} from './validations';

describe('warehouse field validation', () => {
  it.each([
    ['code', validateWarehouseCode, '   ', 'Warehouse code is required'],
    ['name', validateWarehouseName, '   ', 'Warehouse name is required'],
    [
      'address',
      validateWarehouseAddress,
      '   ',
      'Warehouse address is required',
    ],
  ])('rejects an invalid warehouse %s', (_, validate, value, errorMessage) => {
    expect(validate({ value })).toBe(errorMessage);
  });

  it.each([
    ['code', validateWarehouseCode, 'WH-001'],
    ['name', validateWarehouseName, 'Main Warehouse'],
    ['address', validateWarehouseAddress, '123 Commerce Ave'],
  ])('accepts a valid warehouse %s', (_, validate, value) => {
    expect(validate({ value })).toBeUndefined();
  });

  it('trims required values while retaining the optional comment', () => {
    expect(
      createWarehouseSchema.parse({
        code: ' WH-001 ',
        name: ' Main Warehouse ',
        address: ' 123 Commerce Ave ',
        comment: ' Primary stock location ',
      })
    ).toEqual({
      code: 'WH-001',
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: ' Primary stock location ',
    });
  });
});
