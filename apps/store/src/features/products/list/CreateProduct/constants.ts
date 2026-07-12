import type { CreateProductValues } from './types';

export const createProductDefaultValues: CreateProductValues = {
  attributes: null,
  category: null,
  description: '',
  productName: '',
};

export const PRODUCT_GENERATION_MODE = {
  one: 'one',
  many: 'many',
} as const;
