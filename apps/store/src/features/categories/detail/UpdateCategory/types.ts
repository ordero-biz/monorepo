import type { Category } from '@/lib/domain/categories';
import type { CategoryOption } from '../../shared/CategoryFormDialogContent';

export type UpdateCategoryDialogProps = {
  availableCategories: CategoryOption[];
  category: Category;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => Promise<void> | void;
  open: boolean;
};

export type UpdateCategoryDialogTriggerProps = {
  availableCategories: CategoryOption[];
  category: Category;
  onUpdated: () => Promise<void> | void;
};
