export const CLIENT_AUTH_PATHS = {
  signIn: '/api/auth/sign-in',
  logout: '/api/auth/logout',
  session: '/api/auth/session',
} as const;

export const CLIENT_BACKEND_PATHS = {
  attributes: '/api/backend/api/v1/attributes',
  attribute: '/api/backend/api/v1/attributes/{id}',
  attributeValues: '/api/backend/api/v1/attributes/{id}/values',
  attributeValuesBulk: '/api/backend/api/v1/attributes/{id}/values/bulk',
  attributeValuesDelete: '/api/backend/api/v1/attributes/values',
  attributeValue: '/api/backend/api/v1/attributes/values/{id}',
  categories: '/api/backend/api/v1/categories',
  productGroups: '/api/backend/api/v1/products',
  productVariants: '/api/backend/api/v1/products/variants',
  suppliers: '/api/backend/api/v1/suppliers',
  supplier: '/api/backend/api/v1/suppliers/{id}',
  unitsOfMeasurement: '/api/backend/api/v1/units-of-measurement',
  unitOfMeasurement: '/api/backend/api/v1/units-of-measurement/{id}',
  warehouses: '/api/backend/api/v1/warehouses',
  warehouse: '/api/backend/api/v1/warehouses/{id}',
} as const;
