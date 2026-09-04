export const PRODUCTS_LIST_MODE = {
  productVariants: 'product-variants',
  productGroups: 'product-groups',
} as const;

export const PRODUCTS_LIST_MODE_SEARCH_PARAM = 'listMode';

export const PRODUCT_CREATION_MODE = {
  single: 'single',
  multiple: 'multiple',
} as const;

export const PRODUCT_CREATION_MODE_SEARCH_PARAM = 'creationMode';

export type ProductCreationMode =
  (typeof PRODUCT_CREATION_MODE)[keyof typeof PRODUCT_CREATION_MODE];

export const getProductsListMode = (value?: string | string[] | null) => {
  const listMode = Array.isArray(value) ? value[0] : value;

  return listMode === PRODUCTS_LIST_MODE.productGroups
    ? PRODUCTS_LIST_MODE.productGroups
    : PRODUCTS_LIST_MODE.productVariants;
};

export const getProductCreationMode = (
  value?: string | string[] | null
): ProductCreationMode => {
  const creationMode = Array.isArray(value) ? value[0] : value;

  return creationMode === PRODUCT_CREATION_MODE.multiple
    ? PRODUCT_CREATION_MODE.multiple
    : PRODUCT_CREATION_MODE.single;
};
