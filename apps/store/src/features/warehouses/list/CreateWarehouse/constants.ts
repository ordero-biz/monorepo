import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import type { CreateWarehouseFormValues } from './utils/validations';

export const createWarehouseDefaultValues: CreateWarehouseFormValues = {
  name: '',
  address: '',
  comment: '',
  status: WAREHOUSE_STATUS.DRAFT,
};
