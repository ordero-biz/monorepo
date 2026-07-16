import type {
  AsyncComboboxMultipleProps,
  AsyncComboboxSingleProps,
} from '@/lib/components/AsyncCombobox';
import type { AttributeDropdown } from '@/lib/domain/attributes';
import type { PRODUCT_GENERATION_MODE } from './constants';
import type { useCreateProductForm } from './hooks/useCreateProductForm';

export type CreateProductForm = ReturnType<typeof useCreateProductForm>['form'];

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
  onAvailableAttributesChange?: (attributes: AttributeDropdown[]) => void;
  onSelectedAttributesChange?: (attributes: AttributeDropdown[]) => void;
  selectedAttributes?: AttributeDropdown[];
};

export type CreateProductTemplateFieldsProps = {
  onAvailableAttributesChange: (attributes: AttributeDropdown[]) => void;
  form: CreateProductForm;
  generationMode: ProductGenerationMode;
  onGenerationModeChange: (generationMode: ProductGenerationMode) => void;
};

export type ProductAttributeValuesFieldProps = {
  form: CreateProductForm;
};

export type GenerateProductActionsProps = {
  form: CreateProductForm;
  generationMode: ProductGenerationMode;
};

export type GeneratedProductVariantsProps = {
  availableAttributes: AttributeDropdown[];
  form: CreateProductForm;
};

export type GeneratedProductVariantCardProps = {
  attributes: AttributeDropdown[];
  availableAttributes: AttributeDropdown[];
  form: CreateProductForm;
  productVariant: CreateProductVariantValues;
  variantIndex: number;
};

export type EditProductVariantAttributesDialogProps = {
  attributeValueIds: number[];
  attributes: AttributeDropdown[];
  onOpenChange: (open: boolean) => void;
  onUpdate: (attributeValueIds: number[]) => void;
  open: boolean;
  productVariantName: string;
};

export type ProductImageDropzoneProps = {
  className?: string;
  titleId: string;
};

export type CreateProductValues = {
  attributes: AttributeDropdown[];
  attributeValues: Record<string, string[]>;
  category: string | null;
  description: string;
  productName: string;
  productVariants: CreateProductVariantValues[];
};

export type CreateProductVariantValues = {
  attributeValueIds: number[];
  barcode: string;
  description: string;
  name: string;
  sku: string;
};

export type ProductGenerationMode =
  (typeof PRODUCT_GENERATION_MODE)[keyof typeof PRODUCT_GENERATION_MODE];
