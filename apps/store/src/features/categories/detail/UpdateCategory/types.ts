import type { Category } from '@/lib/domain/categories';

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
