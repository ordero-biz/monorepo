import type { Warehouse } from '@/lib/domain/warehouses/types';
import { getWarehouseUpdateChanges } from './getUpdateChanges';

const warehouse: Warehouse = {
  id: 1,
  name: 'Main Warehouse',
  address: '123 Commerce Ave',
  comment: 'Primary stock location',
};

describe('getWarehouseUpdateChanges', () => {
  it('returns only normalized fields that changed', () => {
    expect(
      getWarehouseUpdateChanges({
        warehouse,
        formValue: {
          name: ' Central Warehouse ',
          address: ' 123 Commerce Ave ',
          comment: ' Primary stock location ',
        },
      })
    ).toEqual({ name: 'Central Warehouse' });
  });

  it('returns no changes when normalized values are unchanged', () => {
    expect(
      getWarehouseUpdateChanges({
        warehouse,
        formValue: {
          name: ' Main Warehouse ',
          address: ' 123 Commerce Ave ',
          comment: ' Primary stock location ',
        },
      })
    ).toBeUndefined();
  });

  it('uses null when a persisted address is cleared', () => {
    expect(
      getWarehouseUpdateChanges({
        warehouse,
        formValue: {
          name: 'Main Warehouse',
          address: '',
          comment: 'Primary stock location',
        },
      })
    ).toEqual({ address: null });
  });
});
