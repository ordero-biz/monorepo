import type { Supplier } from '@/lib/domain/suppliers';
import type { SupplierEntityFormValues } from './validations';

export const createSupplierDefaultValues: SupplierEntityFormValues = {
  name: '',
  email: '',
  phone: '',
  address: '',
  comment: '',
};

export const getSupplierDefaultValues = (
  supplier: Supplier
): SupplierEntityFormValues => ({
  name: supplier.name,
  email: supplier.email,
  phone: supplier.phone,
  address: supplier.address,
  comment: supplier.comment,
});
