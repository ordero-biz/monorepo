import type { AsyncComboboxSingleProps } from '@/lib/components/AsyncCombobox';
import type {
  Category,
  CategorySelection,
} from '@/lib/domain/categories/types';

export type CategoriesAsyncComboboxProps = Omit<
  AsyncComboboxSingleProps<CategorySelection>,
  | 'emptyText'
  | 'getOptionLabel'
  | 'getOptionValue'
  | 'renderOption'
  | 'staticOptions'
  | 'isOptionDisabled'
  | 'loadErrorText'
  | 'loadingText'
  | 'loadOptions'
  | 'pageSize'
  | 'queryKey'
> & {
  allowNoParent?: boolean;
  disabledCategoryIds?: readonly Category['id'][];
};

export type CategoryComboboxOption =
  | CategorySelection
  | {
      id: null;
      name: string;
      status?: undefined;
    };
