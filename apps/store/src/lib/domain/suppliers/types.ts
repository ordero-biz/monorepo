import type { SUPPLIER_STATUS } from './constants';

export type SupplierStatus =
  (typeof SUPPLIER_STATUS)[keyof typeof SUPPLIER_STATUS];

export type Supplier = {
  id: number;
  name: string;
  status: SupplierStatus;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  comment?: string | null;
};
