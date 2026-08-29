import type { Supplier } from '@/lib/domain/suppliers/types';
import type { useUpdateSupplierForm } from './hooks/useUpdateSupplierForm';

export type UpdateSupplierDialogProps = {
  onOpenChange: (open: boolean) => void;
  onUpdated: (supplier: Supplier) => Promise<void> | void;
  open: boolean;
  supplier: Supplier;
};

export type UpdateSupplierDialogTriggerProps = {
  onUpdated: (supplier: Supplier) => Promise<void> | void;
  supplier: Supplier;
};

export type UpdateSupplierDialogFormContentProps = {
  form: ReturnType<typeof useUpdateSupplierForm>['form'];
  isSupplierActive: boolean;
};
