import type { Category } from '@/lib/domain/categories';

export type CreateCategoryDialogProps = {
  availableCategories: Category[];
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export type CreateCategoryDialogTriggerProps = {
  availableCategories: Category[];
};
