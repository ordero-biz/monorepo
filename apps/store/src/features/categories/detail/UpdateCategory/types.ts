import type { Category } from '@/lib/domain/categories/types';
import type { useUpdateCategoryForm } from './hooks/useUpdateCategoryForm';

export type UpdateCategoryDialogProps = {
  category: Category;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => Promise<void> | void;
  open: boolean;
};

export type UpdateCategoryDialogTriggerProps = {
  category: Category;
  onUpdated: () => Promise<void> | void;
};

export type UpdateCategoryDialogFormContentProps = {
  disabledCategoryIds: readonly Category['id'][];
  form: ReturnType<typeof useUpdateCategoryForm>['form'];
};
