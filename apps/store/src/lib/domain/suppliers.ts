export const SUPPLIER_STATUS = {
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
} as const;

export type SupplierStatus =
  (typeof SUPPLIER_STATUS)[keyof typeof SUPPLIER_STATUS];

export type Supplier = {
  id: number;
  name: string;
  status: SupplierStatus;
  email: string;
  phone: string;
  address: string;
  comment: string;
};
