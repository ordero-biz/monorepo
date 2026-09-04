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
  suppliers: '/products/suppliers',
  unitsOfMeasurement: '/products/units-of-measurement',
  warehouses: '/products/warehouse',
} as const;

export const getAddProductRoute = (creationMode: ProductCreationMode) =>
  `${clientRoutes.addProduct}?${PRODUCT_CREATION_MODE_SEARCH_PARAM}=${creationMode}`;

export const getAttributeDetailRoute = (attributeId: string | number) =>
  `/products/attributes/${attributeId}`;

export const getCategoryDetailRoute = (categoryId: string | number) =>
  `/products/categories/${categoryId}`;

export const getSupplierDetailRoute = (supplierId: string | number) =>
  `/products/suppliers/${supplierId}`;

export const getWarehouseDetailRoute = (warehouseId: string | number) =>
  `/products/warehouse/${warehouseId}`;

export const getUnitOfMeasurementDetailRoute = (
  unitOfMeasurementId: string | number
) => `/products/units-of-measurement/${unitOfMeasurementId}`;
