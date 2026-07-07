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

export const getAttributeDetailRoute = (attributeId: string | number) =>
  `/products/attributes/${attributeId}`;

export const getSupplierDetailRoute = (supplierId: string | number) =>
  `/products/suppliers/${supplierId}`;
