'use client';

import { getCategories } from '@/lib/client/api/categories';
import {
  AsyncCombobox,
  type AsyncComboboxLoadOptionsArgs,
  type AsyncComboboxLoadOptionsResult,
  type AsyncComboboxSingleProps,
} from '@/lib/components/AsyncCombobox';

type CategoriesAsyncComboboxProps = Omit<
  AsyncComboboxSingleProps,
  | 'emptyText'
  | 'loadErrorText'
  | 'loadingText'
  | 'loadOptions'
  | 'pageSize'
  | 'queryKey'
>;

const categoryComboboxQueryKey = [
  'products',
  'add',
  'category-combobox',
] as const;

const loadCategoryOptions = async ({
  page,
  pageSize,
}: AsyncComboboxLoadOptionsArgs): Promise<AsyncComboboxLoadOptionsResult> => {
  const result = await getCategories({
    page,
    size: pageSize,
    sort: ['name,asc'],
  });

  if (!result.ok) {
    throw result.error;
  }

  return {
    nextPage:
      result.data.page.number + 1 < result.data.page.totalPages
        ? result.data.page.number + 1
        : undefined,
    options: result.data.content.map((category) => ({
      label: category.name,
      value: String(category.id),
    })),
  };
};

export const CategoriesAsyncCombobox = (
  props: CategoriesAsyncComboboxProps
) => (
  <AsyncCombobox
    {...props}
    emptyText="No categories found"
    loadErrorText="We couldn't load categories right now."
    loadingText="Loading categories..."
    loadOptions={loadCategoryOptions}
    pageSize={100}
    queryKey={categoryComboboxQueryKey}
  />
);
