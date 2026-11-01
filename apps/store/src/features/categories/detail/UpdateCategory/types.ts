import type { Category } from '@/lib/domain/categories/types';
import type { useUpdateCategoryForm } from './hooks/useUpdateCategoryForm';

export type UpdateCategoryDialogProps = {
  category: Category;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export type UpdateCategoryDialogTriggerProps = {
  category: Category;
};

export type UpdateCategoryDialogFormContentProps = {
  disabledCategoryIds: readonly Category['id'][];
  form: ReturnType<typeof useUpdateCategoryForm>['form'];
};
