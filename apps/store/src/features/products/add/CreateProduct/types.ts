import type { ReactNode } from 'react';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import type { CategorySelection } from '@/lib/domain/categories/types';
import type { ProductStatus } from '@/lib/domain/products/types';
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
  maxGeneratedProductVariants: number;
  onCreated: () => Promise<void> | void;
  validateConfiguration: Parameters<
    typeof useCreateProductForm
  >[0]['validateConfiguration'];
};

export type ProductVariantsGenerationFormProps = {
  productVariantsGenerationForm: ProductVariantsGenerationFormApi;
  generationMode: ProductGenerationMode;
  maxGeneratedProductVariants: number;
};

export type ProductVariantsCreationFormProps = {
  commonProductFields?: ReactNode;
  variantFields?: ReactNode;
  isEditingProductDetails?: boolean;
  productVariantsCreationForm: ProductVariantsCreationFormApi;
  generatedAttributes: AttributeDropdown[];
  generationMode: ProductGenerationMode;
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
  maxGeneratedProductVariants: number;
};

export type GeneratedProductVariantsProps = {
  productVariantsCreationForm: ProductVariantsCreationFormApi;
  generatedAttributes: AttributeDropdown[];
  generationMode: ProductGenerationMode;
};

export type GeneratedProductVariantListProps = {
  getVariantAttributes: (variantIndex: number) => AttributeDropdown[];
  productVariantsCreationForm: ProductVariantsCreationFormApi;
  invalidVariantIndexes: number[];
  onEditAttributes: (variantIndex: number) => void;
  productVariantCount: number;
  requireAttributeValueIds: boolean;
};

export type GeneratedProductVariantCardProps = {
  attributes: AttributeDropdown[];
  hasErrors: boolean;
  productVariantsCreationForm: ProductVariantsCreationFormApi;
  onEditAttributes: (variantIndex: number) => void;
  requireAttributeValueIds: boolean;
  variantIndex: number;
};

export type EditGeneratedProductVariantAttributesProps = {
  onAttributesUpdated: (
    variantIndex: number,
    attributes: AttributeDropdown[]
  ) => void;
  allowMultipleValuesPerAttribute: boolean;
  attributes: AttributeDropdown[];
  productVariantsCreationForm: ProductVariantsCreationFormApi;
  onOpenChange: (open: boolean) => void;
  variantIndex: number;
};

export type ProductVariantsGeneratedArgs = {
  attributes: AttributeDropdown[];
  category: CategorySelection | null;
  description: string;
  name: string;
  productVariants: CreateProductVariantValues[];
};

export type CommonProductFieldsProps = {
  productVariantsCreationForm: ProductVariantsCreationFormApi;
};

export type EditProductVariantAttributesDialogProps = {
  allowMultipleValuesPerAttribute: boolean;
  attributeValueIds: number[];
  attributes: AttributeDropdown[];
  onOpenChange: (open: boolean) => void;
  onUpdate: (values: ProductVariantAttributesUpdate) => void;
  open: boolean;
  productVariantName: string;
};

export type CommonProductFieldInputsProps = CommonProductFieldsProps;

export type ProductImageDropzoneProps = {
  className?: string;
  titleId: string;
};

export type ProductCommonValues = {
  category: CategorySelection | null;
  description: string;
  name: string;
  status: ProductStatus;
};

export type ProductGenerationValues = {
  attributes: AttributeDropdown[];
  attributeValues: Record<string, string[]>;
  category: CategorySelection | null;
  description: string;
  name: string;
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
  status: ProductStatus;
};

export type ProductStatusSelectorProps = {
  errorText?: string;
  invalid?: boolean;
  label: string;
  name: string;
  onValueChange: (status: ProductStatus) => void;
  value: ProductStatus;
};

export type ProductGenerationMode =
  (typeof PRODUCT_GENERATION_MODE)[keyof typeof PRODUCT_GENERATION_MODE];

export type ProductVariantAttributesProps = Omit<
  GeneratedProductVariantCardProps,
  'hasErrors'
> & { productVariantName: string };

export type ProductVariantAttributesUpdate = {
  attributeValueIds: number[];
  attributes: AttributeDropdown[];
};
