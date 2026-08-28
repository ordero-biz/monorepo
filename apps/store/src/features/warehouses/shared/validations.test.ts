import {
  validateWarehouseAddress,
  validateWarehouseName,
  warehouseFormSchema,
} from './validations';

describe('warehouse field validation', () => {
  it.each([
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
    ['name', validateWarehouseName, 'Main Warehouse'],
    ['address', validateWarehouseAddress, '123 Commerce Ave'],
  ])('accepts a valid warehouse %s', (_, validate, value) => {
    expect(validate({ value })).toBeUndefined();
  });

  it('trims required values while retaining the optional comment', () => {
    expect(
      warehouseFormSchema.parse({
        name: ' Main Warehouse ',
        address: ' 123 Commerce Ave ',
        comment: ' Primary stock location ',
      })
    ).toEqual({
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: ' Primary stock location ',
    });
  });
});
