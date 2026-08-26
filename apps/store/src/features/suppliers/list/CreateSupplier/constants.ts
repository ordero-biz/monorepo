import { SUPPLIER_STATUS } from '@/lib/domain/suppliers';
import type { SupplierEntityFormValues } from '../../shared/SupplierFormDialogContent';

export const createSupplierDefaultValues: SupplierEntityFormValues = {
  name: '',
  status: SUPPLIER_STATUS.DRAFT,
  email: '',
  phone: '',
  address: '',
  comment: '',
};
