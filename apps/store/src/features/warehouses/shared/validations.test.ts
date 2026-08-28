import { validateWarehouseName, warehouseFormSchema } from './validations';

describe('warehouse field validation', () => {
  it('rejects an empty warehouse name', () => {
    expect(validateWarehouseName({ value: '   ' })).toBe(
      'Warehouse name is required'
    );
  });

  it('accepts a valid warehouse name', () => {
    expect(validateWarehouseName({ value: 'Main Warehouse' })).toBeUndefined();
  });

  it('allows an address to be omitted', () => {
    expect(
      warehouseFormSchema.parse({
        name: 'Main Warehouse',
        comment: 'Primary stock location',
      })
    ).toEqual({
      name: 'Main Warehouse',
      comment: 'Primary stock location',
    });
  });

  it('trims required values while retaining optional values', () => {
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
