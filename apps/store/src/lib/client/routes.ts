export const clientRoutes = {
  home: '/',
  signIn: '/sign-in',
  dashboard: '/dashboard',
  attributes: '/products/attributes',
  unitsOfMeasurement: '/products/units-of-measurement',
  warehouses: '/products/warehouse',
} as const;

export const getAttributeDetailRoute = (attributeId: string | number) =>
  `/products/attributes/${attributeId}`;
