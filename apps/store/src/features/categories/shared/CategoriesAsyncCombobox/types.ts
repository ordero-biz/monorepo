import type { AsyncComboboxSingleProps } from '@/lib/components/AsyncCombobox';
import type { Category } from '@/lib/domain/categories';

export type CategoriesAsyncComboboxProps = Omit<
  AsyncComboboxSingleProps,
  | 'emptyText'
  | 'isOptionDisabled'
  | 'loadErrorText'
  | 'loadingText'
  | 'loadOptions'
  | 'pageSize'
  | 'queryKey'
> & {
  disabledCategoryIds?: readonly Category['id'][];
};
