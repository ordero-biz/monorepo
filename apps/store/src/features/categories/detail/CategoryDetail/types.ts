import type { Category } from '@/lib/domain/categories';
import type { CategoryOption } from '../../shared/CategoryFormDialogContent';

export type CategoryDetailProps = {
  categoryId: string;
};

export type CategoryDetailHeaderProps = {
  availableCategories: CategoryOption[];
  category: Category;
  onUpdated: () => Promise<void> | void;
};

export type CategoryDetailInfoProps = {
  category: Category;
};

export type CategoryDetailField = {
  label: string;
  value: string | number | null | undefined;
};
