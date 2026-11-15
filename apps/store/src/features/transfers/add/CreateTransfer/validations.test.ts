import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import {
  validateTransferDestinationWarehouse,
  validateTransferNumber,
  validateTransferSourceWarehouse,
} from './validations';

const mainWarehouse = {
  id: 1,
  name: 'Main Warehouse',
  status: WAREHOUSE_STATUS.ACTIVE,
};
const eastWarehouse = {
  id: 2,
  name: 'East Warehouse',
  status: WAREHOUSE_STATUS.ACTIVE,
};

describe('transfer validations', () => {
  it('requires a name up to 100 characters', () => {
    expect(validateTransferNumber({ value: '  ' })).toBe('Name is required');
    expect(validateTransferNumber({ value: 'a'.repeat(101) })).toBe(
      'Name must be 100 characters or less'
    );
    expect(validateTransferNumber({ value: 'Weekend restock' })).toBe(
      undefined
    );
  });

  it('requires a source warehouse', () => {
    expect(validateTransferSourceWarehouse({ value: null })).toBe(
      'Select a source warehouse'
    );
    expect(validateTransferSourceWarehouse({ value: mainWarehouse })).toBe(
      undefined
    );
  });

  it('requires a destination different from the source', () => {
    expect(
      validateTransferDestinationWarehouse({
        value: null,
        sourceWarehouse: mainWarehouse,
      })
    ).toBe('Select a destination warehouse');
    expect(
      validateTransferDestinationWarehouse({
        value: mainWarehouse,
        sourceWarehouse: mainWarehouse,
      })
    ).toBe('Destination must differ from the source warehouse');
    expect(
      validateTransferDestinationWarehouse({
        value: eastWarehouse,
        sourceWarehouse: mainWarehouse,
      })
    ).toBe(undefined);
  });
});
