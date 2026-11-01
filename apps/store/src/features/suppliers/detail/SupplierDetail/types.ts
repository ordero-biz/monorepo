import type { Supplier } from '@/lib/domain/suppliers/types';

export type SupplierDetailProps = {
  supplierId: string;
};

export type SupplierDetailHeaderProps = {
  supplier: Supplier;
};

export type ActivateSupplierDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  supplier: Supplier;
};

export type ActivateSupplierDialogTriggerProps = {
  supplier: Supplier;
};

export type SupplierDetailInfoProps = {
  supplier: Supplier;
};

export type SupplierDetailField = {
  label: string;
  value: Supplier[keyof Supplier];
};
