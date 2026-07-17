import type { Warehouse } from '@/lib/domain/warehouses';
import type { CreateWarehouseFormValues } from '../../../list/CreateWarehouse/utils/validations';

export const getWarehouseDefaultValues = (
  warehouse: Warehouse
): CreateWarehouseFormValues => ({
  code: warehouse.code,
  name: warehouse.name,
  address: warehouse.address,
  comment: warehouse.comment,
});
