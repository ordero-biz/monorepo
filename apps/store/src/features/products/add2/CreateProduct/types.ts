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
