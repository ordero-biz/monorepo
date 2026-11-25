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

export type ProductGenerationModeSelectorProps = {
  generationMode: ProductGenerationMode;
  onGenerationModeChange: (generationMode: ProductGenerationMode) => void;
};

export type ProductVariantsGenerationFormProps = {
  productVariantsGenerationForm: ProductVariantsGenerationFormApi;
};

export type ProductVariantsCreationFormProps = {
  onSubmit: () => Promise<void>;
  commonProductFields: ReactNode;
  variantFields: ReactNode;
  isEditingProductDetails: boolean;
  productVariantsCreationForm: ProductVariantsCreationFormApi;
};

export type ProductTemplateFieldsProps = {
  productVariantsGenerationForm: ProductVariantsGenerationFormApi;
};

export type ProductVariantSummaryProps = {
  hasAttributes: boolean;
  showSingleVariantExplanation?: boolean;
  variantCount: number;
};

export type ProductAttributeValuesFieldProps = {
  productVariantsGenerationForm: ProductVariantsGenerationFormApi;
};

export type CommonProductDataProps = {
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
  values: ProductCommonValues;
  variantCount: number;
  editorErrors: ProductDetailsErrors;
  activeVariantCount: number;
  onApply: (values: ProductCommonValues) => void;
};

export type ProductDetailsErrors = Partial<
  Record<keyof ProductCommonValues, string>
>;

export type ProductDetailsEditorProps = {
  activeVariantCount: number;
  initialValues: ProductCommonValues;
  initialErrors: ProductDetailsErrors;
  onApply: (values: ProductCommonValues) => void;
  onCancel: () => void;
};

export type ProductVariantsTableProps = {
  productVariantsCreationForm: ProductVariantsCreationFormApi;
  generatedAttributes: AttributeDropdown[];
  generationMode: ProductGenerationMode;
};

type ProductVariantFieldProps = {
  form: ProductVariantsCreationFormApi;
  variantIndex: number;
};

export type ProductVariantDetailsProps = ProductVariantAttributesProps;
export type ProductVariantNameFieldProps = ProductVariantFieldProps;
export type ProductVariantSkuFieldProps = ProductVariantFieldProps;
export type ProductVariantBarcodeFieldProps = ProductVariantFieldProps;
export type ProductVariantStatusFieldProps = ProductVariantFieldProps;

export type GetColumnsArgs = {
  form: ProductVariantsCreationFormApi;
};

export type ProductVariantAttributesProps = {
  attributes: AttributeDropdown[];
  productVariantsCreationForm: ProductVariantsCreationFormApi;
  onEditAttributes: (variantIndex: number) => void;
  requireAttributeValueIds: boolean;
  variantIndex: number;
  productVariantName: string;
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
  status: ProductStatus;
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

export type ProductGenerationFormValues = ProductGenerationValues & {
  generationMode: ProductGenerationMode;
  status: ProductStatus;
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
  draftDescription?: string;
  activeDescription?: string;
  errorText?: string;
  invalid?: boolean;
  label: string;
  name: string;
  onValueChange: (status: ProductStatus) => void;
  value: ProductStatus;
};

export type ProductGenerationMode =
  (typeof PRODUCT_GENERATION_MODE)[keyof typeof PRODUCT_GENERATION_MODE];

export type ProductVariantAttributesUpdate = {
  attributeValueIds: number[];
  attributes: AttributeDropdown[];
};
