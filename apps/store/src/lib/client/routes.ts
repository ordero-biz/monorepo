export const clientRoutes = {
  home: '/',
  signIn: '/sign-in',
  dashboard: '/dashboard',
  products: '/products',
  addProduct: '/products/add',
  attributes: '/products/attributes',
  suppliers: '/products/suppliers',
  unitsOfMeasurement: '/products/units-of-measurement',
  warehouses: '/products/warehouse',
} as const;

export const getAttributeDetailRoute = (attributeId: string | number) =>
  `/products/attributes/${attributeId}`;
