import type { Supplier } from '@/lib/domain/suppliers/types';
import type { UpdateSupplierFormValues } from './validations';

export const getSupplierDefaultValues = (
  supplier: Supplier
): UpdateSupplierFormValues => ({
  name: supplier.name,
  email: supplier.email ?? undefined,
  phone: supplier.phone ?? undefined,
  address: supplier.address ?? undefined,
  comment: supplier.comment ?? undefined,
});
