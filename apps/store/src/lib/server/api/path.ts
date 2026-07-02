export const BACKEND_AUTH_PATHS = {
  signIn: '/api/v1/employees/sign-in',
  me: '/api/v1/employees/me',
} as const;

export const BACKEND_ATTRIBUTE_PATHS = {
  attribute: '/api/v1/attributes/{id}',
  attributeValues: '/api/v1/attributes/{id}/values',
} as const;

export const BACKEND_CATEGORY_PATHS = {
  categories: '/api/v1/categories',
} as const;

export const BACKEND_SUPPLIER_PATHS = {
  suppliers: '/api/v1/suppliers',
} as const;

export const BACKEND_UNITS_OF_MEASUREMENT_PATHS = {
  unitsOfMeasurement: '/api/v1/units-of-measurement',
} as const;

export const BACKEND_WAREHOUSE_PATHS = {
  warehouses: '/api/v1/warehouses',
} as const;
