import type { Category } from '@/lib/domain/categories';

export type CategoryDetailProps = {
  categoryId: string;
};

export type CategoryDetailHeaderProps = {
  category: Category;
  onUpdated: () => Promise<void> | void;
};

export type CategoryDetailInfoProps = {
  category: Category;
};

export type CategoryDetailChildrenProps = {
  categoryId: string;
};

export type CategoryDetailField = {
  label: string;
  value: string | number | null | undefined;
};

export type ActivateCategoryDialogTriggerProps = {
  category: Category;
  onUpdated: () => Promise<void> | void;
};

export type ActivateCategoryDialogProps = {
  category: Category;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => Promise<void> | void;
  open: boolean;
};
