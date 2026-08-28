import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import type { CreateSupplierFormValues } from './utils/validations';

export const createSupplierDefaultValues: CreateSupplierFormValues = {
  name: '',
  status: SUPPLIER_STATUS.DRAFT,
  email: '',
  phone: '',
  address: '',
  comment: '',
};
