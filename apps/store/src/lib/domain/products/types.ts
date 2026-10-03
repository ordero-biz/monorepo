import type { PRODUCT_STATUS } from './constants';

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export type ProductCategory = {
  id: number;
  name: string;
  createdAt: string;
};

export type ProductVariantAttribute = {
  id: number;
  name: string;
  sortOrder: number;
  createdAt: string;
};

export type ProductVariantAttributeValue = {
  id: number;
  name: string;
  sortOrder: number;
  createdAt: string;
};

export type ProductVariantAttributeValueLink = {
  id: number;
  attribute: ProductVariantAttribute;
  attributeValue: ProductVariantAttributeValue;
};

export type ProductGroup = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  category: ProductCategory;
};

export type ProductVariant = {
  id: number;
  name: string;
  description: string;
  sku: string;
  barcode: string;
  createdAt: string;
  productVariantAttributeValues: ProductVariantAttributeValueLink[];
};
