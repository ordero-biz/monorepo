import type { ProductAddFormValues } from './types';

export const productAddDefaultValues: ProductAddFormValues = {
  attributes: null,
  category: null,
  description: '',
  productName: '',
};

export const PRODUCT_GENERATION_MODE = {
  one: 'one',
  many: 'many',
} as const;
