import { z } from 'zod';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { getValidationMessage } from '@/lib/utils/form/validation/message';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';
import { warehouseFormSchema } from '../../../shared/validations';

export const warehouseStatusSchema = z.enum(
  [WAREHOUSE_STATUS.DRAFT, WAREHOUSE_STATUS.ACTIVE],
  {
    error: 'Warehouse status must be Draft or Active',
  }
);

export const createWarehouseFormSchema = warehouseFormSchema.extend({
  status: warehouseStatusSchema,
});

export type CreateWarehouseFormValues = z.infer<
  typeof createWarehouseFormSchema
>;

export const validateWarehouseStatus = ({
  value,
}: ValidationArgs<CreateWarehouseFormValues['status']>) => {
  return getValidationMessage(warehouseStatusSchema, value);
};
