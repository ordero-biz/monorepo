import type {
  AsyncComboboxMultipleProps,
  AsyncComboboxSingleProps,
} from '@/lib/components/AsyncCombobox';
import type { AttributeDropdown } from '@/lib/domain/attributes';
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

export type AttributesAsyncComboboxProps = Omit<
  AsyncComboboxMultipleProps,
  | 'emptyText'
  | 'loadErrorText'
  | 'loadingText'
  | 'loadOptions'
  | 'pageSize'
  | 'queryKey'
> & {
  onSelectedAttributesChange?: (attributes: AttributeDropdown[]) => void;
  selectedAttributes?: AttributeDropdown[];
};

export type CreateProductValues = {
  attributes: AttributeDropdown[];
  attributeValues: Record<string, string[]>;
  category: string | null;
  description: string;
  productName: string;
};

export type ProductGenerationMode =
  (typeof PRODUCT_GENERATION_MODE)[keyof typeof PRODUCT_GENERATION_MODE];
