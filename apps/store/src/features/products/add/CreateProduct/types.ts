import type { AsyncComboboxMultipleProps } from '@/lib/components/AsyncCombobox';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import type { PRODUCT_GENERATION_MODE } from './constants';
import type { useCreateProductForm } from './hooks/useCreateProductForm';
import type { useProductVariantsGenerationForm } from './hooks/useProductVariantsGenerationForm';

export type ProductVariantsCreationFormApi = ReturnType<
  typeof useCreateProductForm
>['form'];

export type ProductVariantsGenerationFormApi = ReturnType<
  typeof useProductVariantsGenerationForm
>['form'];

export type CreateProductProps = {
  generationMode: ProductGenerationMode;
  onCreated: () => Promise<void> | void;
  validateConfiguration: Parameters<
    typeof useCreateProductForm
  >[0]['validateConfiguration'];
};

export type ProductVariantsGenerationFormProps = {
  productVariantsGenerationForm: ProductVariantsGenerationFormApi;
  generationMode: ProductGenerationMode;
};

export type ProductVariantsCreationFormProps = {
  productVariantsCreationForm: ProductVariantsCreationFormApi;
  generatedAttributes: AttributeDropdown[];
  generationMode: ProductGenerationMode;
};

export type AttributesAsyncComboboxProps = Omit<
  AsyncComboboxMultipleProps,
  | 'emptyText'
  | 'isOptionDisabled'
  | 'loadErrorText'
  | 'loadingText'
  | 'loadOptions'
  | 'onOptionSelect'
  | 'pageSize'
  | 'queryKey'
  | 'staticOptions'
> & {
  onSelectedAttributesChange?: (attributes: AttributeDropdown[]) => void;
  selectedAttributes?: AttributeDropdown[];
};

export type ProductTemplateFieldsProps = {
  productVariantsGenerationForm: ProductVariantsGenerationFormApi;
  generationMode: ProductGenerationMode;
};

export type ProductAttributeValuesFieldProps = {
  productVariantsGenerationForm: ProductVariantsGenerationFormApi;
};

export type GenerateProductActionsProps = {
  productVariantsGenerationForm: ProductVariantsGenerationFormApi;
  generationMode: ProductGenerationMode;
};

export type GeneratedProductVariantsProps = {
  productVariantsCreationForm: ProductVariantsCreationFormApi;
  generatedAttributes: AttributeDropdown[];
  generationMode: ProductGenerationMode;
};

export type GeneratedProductVariantListProps = {
  attributes: AttributeDropdown[];
  productVariantsCreationForm: ProductVariantsCreationFormApi;
  invalidVariantIndexes: number[];
  onEditAttributes: (variantIndex: number) => void;
  productVariantCount: number;
  requireAttributeValueIds: boolean;
};

export type GeneratedProductVariantCardProps = {
  attributes: AttributeDropdown[];
  productVariantsCreationForm: ProductVariantsCreationFormApi;
  onEditAttributes: (variantIndex: number) => void;
  requireAttributeValueIds: boolean;
  variantIndex: number;
};

export type EditGeneratedProductVariantAttributesProps = {
  allowMultipleValuesPerAttribute: boolean;
  attributes: AttributeDropdown[];
  productVariantsCreationForm: ProductVariantsCreationFormApi;
  onOpenChange: (open: boolean) => void;
  variantIndex: number;
};

export type ProductVariantsGeneratedArgs = ProductVariantsCreationValues & {
  attributes: AttributeDropdown[];
};

export type CommonProductFieldsProps = {
  productVariantsCreationForm: ProductVariantsCreationFormApi;
};

export type EditProductVariantAttributesDialogProps = {
  allowMultipleValuesPerAttribute: boolean;
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

export type ProductCommonValues = {
  category: string | null;
  description: string;
  name: string;
};

export type ProductGenerationValues = ProductCommonValues & {
  attributes: AttributeDropdown[];
  attributeValues: Record<string, string[]>;
};

export type ProductVariantsCreationValues = ProductCommonValues & {
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
