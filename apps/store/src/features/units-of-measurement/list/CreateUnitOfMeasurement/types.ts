import type { useCreateUnitOfMeasurementForm } from './hooks/useCreateUnitOfMeasurementForm';

export type CreateUnitOfMeasurementDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export type CreateUnitOfMeasurementDialogFormContentProps = {
  form: ReturnType<typeof useCreateUnitOfMeasurementForm>['form'];
};
