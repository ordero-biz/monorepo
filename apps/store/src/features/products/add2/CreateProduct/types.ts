import type { FocusEventHandler } from 'react';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import type {
  ProductGenerationValues as BaseProductGenerationValues,
  PRODUCT_GENERATION_MODE,
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

export type AttributesAsyncComboboxProps = {
  'aria-describedby': string;
  id: string;
  invalid?: boolean;
  onAttributeSelected: (attribute: AttributeDropdown) => void;
  onBlur: FocusEventHandler<HTMLInputElement>;
  selectedAttributes: AttributeDropdown[];
};
