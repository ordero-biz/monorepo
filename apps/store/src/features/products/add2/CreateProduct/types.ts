import type { FocusEventHandler } from 'react';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import type {
  PRODUCT_GENERATION_MODE,
  ProductVariantsGenerationFormApi,
} from '../../add/CreateProduct';

export type ProductGenerationMode =
  (typeof PRODUCT_GENERATION_MODE)[keyof typeof PRODUCT_GENERATION_MODE];

export type ProductGenerationModeSelectorProps = {
  generationMode: ProductGenerationMode;
  onGenerationModeChange: (generationMode: ProductGenerationMode) => void;
};

export type ProductVariantsGenerationFormProps = {
  productVariantsGenerationForm: ProductVariantsGenerationFormApi;
} & ProductGenerationModeSelectorProps;

export type ProductTemplateFieldsProps = {
  productVariantsGenerationForm: ProductVariantsGenerationFormApi;
};

export type ProductAttributeValuesFieldProps = {
  generationMode: ProductGenerationMode;
  productVariantsGenerationForm: ProductVariantsGenerationFormApi;
};

export type AttributesAsyncComboboxProps = {
  invalid?: boolean;
  onAttributeSelected: (attribute: AttributeDropdown) => void;
  onBlur: FocusEventHandler<HTMLInputElement>;
  selectedAttributes: AttributeDropdown[];
};
