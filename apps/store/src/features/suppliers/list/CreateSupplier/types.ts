import type { useCreateSupplierForm } from './hooks/useCreateSupplierForm';

export type CreateSupplierDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export type CreateSupplierDialogFormContentProps = {
  form: ReturnType<typeof useCreateSupplierForm>['form'];
};
