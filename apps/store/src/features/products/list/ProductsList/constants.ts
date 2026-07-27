export const PRODUCTS_LIST_MODE = {
  productVariants: 'products',
  productGroups: 'product-groups',
} as const;

export const PRODUCTS_LIST_MODE_SEARCH_PARAM = 'listMode';

export const getProductsListMode = (value?: string | string[] | null) => {
  const listMode = Array.isArray(value) ? value[0] : value;

  return listMode === PRODUCTS_LIST_MODE.productGroups
    ? PRODUCTS_LIST_MODE.productGroups
    : PRODUCTS_LIST_MODE.productVariants;
};
