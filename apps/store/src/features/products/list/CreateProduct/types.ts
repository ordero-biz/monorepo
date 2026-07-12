import type { AsyncComboboxSingleProps } from '@/lib/components/AsyncCombobox';
import type { PRODUCT_GENERATION_MODE } from './constants';

export type CategoriesAsyncComboboxProps = Omit<
  AsyncComboboxSingleProps,
  | 'emptyText'
  | 'loadErrorText'
  | 'loadingText'
  | 'loadOptions'
  | 'pageSize'
  | 'queryKey'
>;

export type CreateProductValues = {
  attributes: string | null;
  category: string | null;
  description: string;
  productName: string;
};

export type ProductGenerationMode =
  (typeof PRODUCT_GENERATION_MODE)[keyof typeof PRODUCT_GENERATION_MODE];
