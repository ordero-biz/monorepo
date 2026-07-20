import { z } from 'zod';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const warehouseCodeSchema = z
  .string()
  .trim()
  .min(1, 'Warehouse code is required');

export const warehouseNameSchema = z
  .string()
  .trim()
  .min(1, 'Warehouse name is required');

export const warehouseAddressSchema = z
  .string()
  .trim()
  .min(1, 'Warehouse address is required');

export const warehouseFormSchema = z.object({
  code: warehouseCodeSchema,
  name: warehouseNameSchema,
  address: warehouseAddressSchema,
  comment: z.string(),
});

export type WarehouseFormValues = z.infer<typeof warehouseFormSchema>;

const getValidationMessage = (schema: z.ZodString, value: string) => {
  const result = schema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateWarehouseCode = ({ value }: ValidationArgs<string>) =>
  getValidationMessage(warehouseCodeSchema, value);

export const validateWarehouseName = ({ value }: ValidationArgs<string>) =>
  getValidationMessage(warehouseNameSchema, value);

export const validateWarehouseAddress = ({ value }: ValidationArgs<string>) =>
  getValidationMessage(warehouseAddressSchema, value);
