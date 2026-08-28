import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses';
import type { CreateWarehouseFormValues } from './utils/validations';

export const createWarehouseDefaultValues: CreateWarehouseFormValues = {
  code: '',
  name: '',
  address: '',
  comment: '',
  status: WAREHOUSE_STATUS.DRAFT,
};
