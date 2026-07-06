import type { PRODUCT_GENERATION_MODE } from './constants';

export type ProductAddFormValues = {
  attributes: string | null;
  category: string | null;
  description: string;
  productName: string;
};

export type ProductGenerationMode = (typeof PRODUCT_GENERATION_MODE)[keyof typeof PRODUCT_GENERATION_MODE];
