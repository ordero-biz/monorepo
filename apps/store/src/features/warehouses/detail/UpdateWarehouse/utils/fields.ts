import type { Warehouse } from '@/lib/domain/warehouses';
import type { WarehouseFormValues } from '../../../shared/validations';

export const getWarehouseDefaultValues = (
  warehouse: Warehouse
): WarehouseFormValues => ({
  code: warehouse.code,
  name: warehouse.name,
  address: warehouse.address,
  comment: warehouse.comment,
});
