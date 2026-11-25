import { z } from 'zod';
import { getValidationMessage } from '@/lib/utils/form/validation/message';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const warehouseNameSchema = z
  .string()
  .trim()
  .min(1, 'Warehouse name is required');

export const warehouseAddressSchema = z.string().trim().optional();

export const warehouseFormSchema = z.object({
  name: warehouseNameSchema,
  address: warehouseAddressSchema,
  comment: z.string(),
});

export type WarehouseFormValues = z.infer<typeof warehouseFormSchema>;

export const validateWarehouseName = ({ value }: ValidationArgs<string>) =>
  getValidationMessage(warehouseNameSchema, value);
