import type { Supplier } from '@/lib/domain/suppliers/types';

export type SupplierDetailProps = {
  supplierId: string;
};

export type SupplierDetailHeaderProps = {
  onUpdated: () => Promise<void> | void;
  supplier: Supplier;
};

export type SupplierDetailInfoProps = {
  supplier: Supplier;
};

export type SupplierDetailField = {
  label: string;
  value: Supplier[keyof Supplier];
};
