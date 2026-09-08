import { PRODUCT_STATUS } from '@/lib/domain/products/constants';
import type {
  ProductGenerationValues,
  ProductVariantsCreationValues,
} from './types';

export const PRODUCT_GENERATION_MODE = {
  one: 'one',
  many: 'many',
} as const;

export const createProductGenerationDefaultValues: ProductGenerationValues = {
  attributes: [],
  attributeValues: {},
  category: null,
  description: '',
  name: '',
};

export const createProductVariantsCreationDefaultValues: ProductVariantsCreationValues =
  {
    category: null,
    description: '',
    name: '',
    productVariants: [],
    status: PRODUCT_STATUS.DRAFT,
  };
