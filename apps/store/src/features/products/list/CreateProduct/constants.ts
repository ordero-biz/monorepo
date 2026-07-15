import type { CreateProductValues } from './types';

export const createProductDefaultValues: CreateProductValues = {
  attributes: [],
  attributeValues: {},
  category: null,
  description: '',
  productName: '',
  productVariants: [],
};

export const PRODUCT_GENERATION_MODE = {
  one: 'one',
  many: 'many',
} as const;
