import type { Supplier } from '@/lib/domain/suppliers';

export type UpdateSupplierDialogProps = {
  onOpenChange: (open: boolean) => void;
  onUpdated: () => Promise<void> | void;
  open: boolean;
  supplier: Supplier;
};

export type UpdateSupplierDialogTriggerProps = {
  onUpdated: () => Promise<void> | void;
  supplier: Supplier;
};
