import type {
  ProductGenerationValues as BaseProductGenerationValues,
  GeneratedProductVariantsProps,
  PRODUCT_GENERATION_MODE,
  ProductCommonValues,
  ProductVariantAttributesProps,
  ProductVariantsCreationFormApi,
} from '../../add/CreateProduct';
import type { useProductVariantsGenerationForm } from './hooks/useProductVariantsGenerationForm';

export type ProductVariantsGenerationFormApi = ReturnType<
  typeof useProductVariantsGenerationForm
>['form'];

export type ProductGenerationMode =
  (typeof PRODUCT_GENERATION_MODE)[keyof typeof PRODUCT_GENERATION_MODE];

export type ProductGenerationValues = BaseProductGenerationValues & {
  generationMode: ProductGenerationMode;
};

export type ProductGenerationModeSelectorProps = {
  generationMode: ProductGenerationMode;
  onGenerationModeChange: (generationMode: ProductGenerationMode) => void;
};

export type ProductVariantsGenerationFormProps = {
  productVariantsGenerationForm: ProductVariantsGenerationFormApi;
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
  onApply: (values: ProductCommonValues) => void;
};

export type ProductDetailsErrors = Partial<
  Record<keyof ProductCommonValues, string>
>;

export type ProductDetailsEditorProps = {
  initialValues: ProductCommonValues;
  initialErrors: ProductDetailsErrors;
  onApply: (values: ProductCommonValues) => void;
  onCancel: () => void;
};

type ProductVariantFieldProps = {
  form: ProductVariantsCreationFormApi;
  variantIndex: number;
};

export type ProductVariantDetailsProps = ProductVariantAttributesProps;

export type ProductVariantsTableProps = GeneratedProductVariantsProps;

export type ProductVariantNameFieldProps = ProductVariantFieldProps;
export type ProductVariantSkuFieldProps = ProductVariantFieldProps;
export type ProductVariantBarcodeFieldProps = ProductVariantFieldProps;
export type ProductVariantStatusFieldProps = ProductVariantFieldProps;

export type GetColumnsArgs = {
  form: ProductVariantsCreationFormApi;
};
