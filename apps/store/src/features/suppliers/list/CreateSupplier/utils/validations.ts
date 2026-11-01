import { z } from 'zod';
import {
  supplierAddressSchema,
  supplierCommentSchema,
  supplierEmailSchema,
  supplierNameSchema,
  supplierPhoneSchema,
  supplierStatusSchema,
} from '../../../shared/validations';

export const createSupplierFormSchema = z.object({
  name: supplierNameSchema,
  status: supplierStatusSchema,
  email: supplierEmailSchema,
  phone: supplierPhoneSchema,
  address: supplierAddressSchema,
  comment: supplierCommentSchema,
});

export type CreateSupplierFormValues = z.infer<typeof createSupplierFormSchema>;
