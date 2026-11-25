import type { useCreateCategoryForm } from './hooks/useCreateCategoryForm';

export type CreateCategoryDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export type CreateCategoryDialogFormContentProps = {
  form: ReturnType<typeof useCreateCategoryForm>['form'];
};
