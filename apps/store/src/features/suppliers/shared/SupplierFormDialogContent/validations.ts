import { z } from 'zod';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const supplierNameSchema = z
  .string()
  .trim()
  .min(1, 'Supplier name is required');

export const supplierEmailSchema = z
  .string()
  .trim()
  .min(1, 'Supplier email is required')
  .email('Enter a valid supplier email');

export const supplierPhoneSchema = z
  .string()
  .trim()
  .min(1, 'Supplier phone is required');

export const supplierAddressSchema = z
  .string()
  .trim()
  .min(1, 'Supplier address is required');

export const supplierEntitySchema = z.object({
  name: supplierNameSchema,
  email: supplierEmailSchema,
  phone: supplierPhoneSchema,
  address: supplierAddressSchema,
  comment: z.string(),
});

export type SupplierEntityFormValues = z.infer<typeof supplierEntitySchema>;
export type CreateSupplierFormValues = SupplierEntityFormValues;

const getValidationMessage = (schema: z.ZodString, value: string) => {
  const result = schema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateSupplierName = ({ value }: ValidationArgs<string>) =>
  getValidationMessage(supplierNameSchema, value);

export const validateSupplierEmail = ({ value }: ValidationArgs<string>) =>
  getValidationMessage(supplierEmailSchema, value);

export const validateSupplierPhone = ({ value }: ValidationArgs<string>) =>
  getValidationMessage(supplierPhoneSchema, value);

export const validateSupplierAddress = ({ value }: ValidationArgs<string>) =>
  getValidationMessage(supplierAddressSchema, value);
