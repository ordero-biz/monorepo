import type { CreateProductValues } from './types';

export const PRODUCT_GENERATION_MODE = {
  one: 'one',
  many: 'many',
} as const;

export const createProductDefaultValues: CreateProductValues = {
  attributes: [],
  attributeValues: {},
  category: null,
  description: '',
  productName: '',
  productVariants: [],
  productVariantsGenerationMode: PRODUCT_GENERATION_MODE.one,
};
