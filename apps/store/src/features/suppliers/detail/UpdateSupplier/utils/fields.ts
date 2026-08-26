import type { Supplier } from '@/lib/domain/suppliers';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers';
import type { SupplierEntityFormValues } from '../../../shared/SupplierFormDialogContent';

export const getSupplierDefaultValues = (
  supplier: Supplier
): SupplierEntityFormValues => ({
  name: supplier.name,
  status: supplier.status ?? SUPPLIER_STATUS.DRAFT,
  email: supplier.email,
  phone: supplier.phone,
  address: supplier.address,
  comment: supplier.comment,
});
