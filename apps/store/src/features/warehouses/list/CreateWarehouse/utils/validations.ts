import { z } from 'zod';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses';
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
  const result = warehouseStatusSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
