import type { useCreateAttributeForm } from './hooks/useCreateAttributeForm';

export type CreateAttributeDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export type CreateAttributeDialogFormContentProps = {
  form: ReturnType<typeof useCreateAttributeForm>['form'];
  open: boolean;
};

export type CreateAttributeValuesFieldProps = {
  form: ReturnType<typeof useCreateAttributeForm>['form'];
  open: boolean;
};
