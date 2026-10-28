import type { Supplier } from '@/lib/domain/suppliers/types';
import type { useUpdateSupplierForm } from './hooks/useUpdateSupplierForm';

export type UpdateSupplierDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  supplier: Supplier;
};

export type UpdateSupplierDialogTriggerProps = {
  supplier: Supplier;
};

export type UpdateSupplierDialogFormContentProps = {
  form: ReturnType<typeof useUpdateSupplierForm>['form'];
  isSupplierActive: boolean;
};
