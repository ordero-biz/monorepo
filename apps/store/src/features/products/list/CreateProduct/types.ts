import type { AsyncComboboxMultipleProps } from '@/lib/components/AsyncCombobox';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import type { PRODUCT_GENERATION_MODE } from './constants';
import type { useCreateProductForm } from './hooks/useCreateProductForm';

export type CreateProductForm = ReturnType<typeof useCreateProductForm>['form'];

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

export type CreateProductTemplateFieldsProps = {
  form: CreateProductForm;
  generationMode: ProductGenerationMode;
  onGenerationModeChange: (generationMode: ProductGenerationMode) => void;
};

export type ProductAttributeValuesFieldProps = {
  form: CreateProductForm;
};

export type GenerateProductActionsProps = {
  form: CreateProductForm;
  generatedTemplateSignature?: string;
  generationMode: ProductGenerationMode;
  onProductVariantsGenerated: (args: ProductVariantsGeneratedArgs) => void;
};

export type GeneratedProductVariantsProps = {
  form: CreateProductForm;
  generatedAttributes: AttributeDropdown[];
  generationVersion: number;
};

export type GeneratedProductVariantListProps = {
  attributes: AttributeDropdown[];
  form: CreateProductForm;
  onEditAttributes: (variantIndex: number) => void;
  productVariantCount: number;
  requireAttributeValueIds: boolean;
};

export type GeneratedProductVariantCardProps = {
  attributes: AttributeDropdown[];
  form: CreateProductForm;
  onEditAttributes: (variantIndex: number) => void;
  requireAttributeValueIds: boolean;
  variantIndex: number;
};

export type ProductVariantsGeneratedArgs = {
  attributes: AttributeDropdown[];
  generationSignature: string;
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

export type CreateProductValues = {
  attributes: AttributeDropdown[];
  attributeValues: Record<string, string[]>;
  category: string | null;
  description: string;
  productName: string;
  productVariants: CreateProductVariantValues[];
  productVariantsGenerationMode: ProductGenerationMode;
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
