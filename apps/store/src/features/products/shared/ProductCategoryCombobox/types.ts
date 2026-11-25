import type { CategoriesAsyncComboboxProps } from '@/features/categories';
import type { CategorySelection } from '@/lib/domain/categories/types';

export type ProductCategoryComboboxProps = Pick<
  CategoriesAsyncComboboxProps,
  | 'errorText'
  | 'invalid'
  | 'label'
  | 'name'
  | 'onBlur'
  | 'placeholder'
  | 'required'
  | 'size'
> & {
  value: CategorySelection | null;
  onValueChange: (category: CategorySelection | null) => void;
};

export type ReviewProductCategoryProps = {
  category: CategorySelection;
  onSelect: (category: CategorySelection) => void;
  onBusyChange: (busy: boolean) => void;
};
