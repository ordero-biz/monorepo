export const WAREHOUSE_STATUS = {
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
} as const;

export const WAREHOUSE_LIST_MODE = {
  products: 'products',
  supplies: 'supplies',
} as const;

export const WAREHOUSE_LIST_MODE_SEARCH_PARAM = 'view';

export const getWarehouseListMode = (value?: string | string[] | null) => {
  const listMode = Array.isArray(value) ? value[0] : value;

  return listMode === WAREHOUSE_LIST_MODE.supplies
    ? WAREHOUSE_LIST_MODE.supplies
    : WAREHOUSE_LIST_MODE.products;
};
