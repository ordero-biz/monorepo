import type { Warehouse } from '@/lib/domain/warehouses/types';
import type { WarehouseFormValues } from '../../../shared/validations';

export const getWarehouseDefaultValues = (
  warehouse: Warehouse
): WarehouseFormValues => ({
  name: warehouse.name,
  address: warehouse.address ?? undefined,
  comment: warehouse.comment,
});
