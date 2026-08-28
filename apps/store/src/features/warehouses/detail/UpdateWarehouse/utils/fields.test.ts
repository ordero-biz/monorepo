import type { Warehouse } from '@/lib/domain/warehouses';
import { getWarehouseDefaultValues } from './fields';

describe('getWarehouseDefaultValues', () => {
  it('maps a warehouse to editable update form values', () => {
    const warehouse: Warehouse = {
      id: 1,
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
    };

    const result = getWarehouseDefaultValues(warehouse);

    expect(result).toEqual({
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
    });
    expect(result).not.toHaveProperty('id');
    expect(result).not.toHaveProperty('status');
  });

  it('normalizes an absent address to undefined', () => {
    expect(
      getWarehouseDefaultValues({
        id: 1,
        name: 'Main Warehouse',
        comment: 'Primary stock location',
      })
    ).toStrictEqual({
      name: 'Main Warehouse',
      address: undefined,
      comment: 'Primary stock location',
    });
  });
});
