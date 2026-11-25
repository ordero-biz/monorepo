import { z } from 'zod';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import { getValidationMessage } from '@/lib/utils/form/validation/message';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const supplierNameSchema = z
  .string()
  .trim()
  .min(1, 'Supplier name is required');

export const supplierEmailSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      value.length === 0 || z.string().email().safeParse(value).success,
    'Enter a valid supplier email'
  )
  .optional();

export const supplierPhoneSchema = z.string().trim().optional();

export const supplierAddressSchema = z.string().trim().optional();

export const supplierCommentSchema = z.string().trim().optional();

export const supplierStatusSchema = z.enum([
  SUPPLIER_STATUS.DRAFT,
  SUPPLIER_STATUS.ACTIVE,
]);

export const validateSupplierName = ({ value }: ValidationArgs<string>) => {
  return getValidationMessage(supplierNameSchema, value);
};

export const validateSupplierStatus = ({
  value,
}: ValidationArgs<z.infer<typeof supplierStatusSchema>>) => {
  return getValidationMessage(supplierStatusSchema, value);
};

export const validateSupplierEmail = ({
  value,
}: ValidationArgs<z.infer<typeof supplierEmailSchema>>) => {
  return getValidationMessage(supplierEmailSchema, value);
};
