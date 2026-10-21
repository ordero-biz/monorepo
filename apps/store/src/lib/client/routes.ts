import {
  PRODUCT_CREATION_MODE_SEARCH_PARAM,
  type ProductCreationMode,
} from '@/lib/domain/products/constants';

export const clientRoutes = {
  home: '/',
  signIn: '/sign-in',
  dashboard: '/dashboard',
  products: '/products',
  addProduct: '/products/add',
  categories: '/products/categories',
  attributes: '/products/attributes',
  supplies: '/warehouse/supplies',
  addSupply: '/warehouse/supplies/add',
  suppliers: '/warehouse/suppliers',
  unitsOfMeasurement: '/products/units-of-measurement',
  warehouses: '/warehouse',
} as const;

export const getAddProductRoute = (creationMode: ProductCreationMode) =>
  `${clientRoutes.addProduct}?${PRODUCT_CREATION_MODE_SEARCH_PARAM}=${creationMode}`;

export const getAttributeDetailRoute = (attributeId: string | number) =>
  `/products/attributes/${attributeId}`;

export const getCategoryDetailRoute = (categoryId: string | number) =>
  `/products/categories/${categoryId}`;

export const getSupplierDetailRoute = (supplierId: string | number) =>
  `/warehouse/suppliers/${supplierId}`;

export const getSupplyDetailRoute = (supplyId: string | number) =>
  `/warehouse/supplies/${supplyId}`;

export const getWarehouseDetailRoute = (warehouseId: string | number) =>
  `/warehouse/${warehouseId}`;

export const getUnitOfMeasurementDetailRoute = (
  unitOfMeasurementId: string | number
) => `/products/units-of-measurement/${unitOfMeasurementId}`;
