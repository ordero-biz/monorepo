import { z } from 'zod';
import {
  supplierAddressSchema,
  supplierCommentSchema,
  supplierEmailSchema,
  supplierNameSchema,
  supplierPhoneSchema,
} from '../../../shared/validations';

export const updateSupplierFormSchema = z.object({
  name: supplierNameSchema,
  email: supplierEmailSchema,
  phone: supplierPhoneSchema,
  address: supplierAddressSchema,
  comment: supplierCommentSchema,
});

export type UpdateSupplierFormValues = z.infer<typeof updateSupplierFormSchema>;
