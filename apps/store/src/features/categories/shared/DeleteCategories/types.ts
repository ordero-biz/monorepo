import type { Category } from '@/lib/domain/categories/types';

export type DeleteCategoriesDialogProps = {
  categories: Category[];
  onDeleted?: () => void | Promise<void>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};
