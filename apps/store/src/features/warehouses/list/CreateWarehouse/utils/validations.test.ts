import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { validateWarehouseStatus, warehouseStatusSchema } from './validations';

describe('warehouse creation status validation', () => {
  it('accepts Draft and Active statuses', () => {
    expect(
      validateWarehouseStatus({ value: WAREHOUSE_STATUS.DRAFT })
    ).toBeUndefined();
    expect(
      validateWarehouseStatus({ value: WAREHOUSE_STATUS.ACTIVE })
    ).toBeUndefined();
  });

  it('rejects unsupported statuses', () => {
    expect(warehouseStatusSchema.safeParse('ARCHIVED').success).toBe(false);
  });
});
