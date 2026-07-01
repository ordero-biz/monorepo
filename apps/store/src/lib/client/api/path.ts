export const CLIENT_AUTH_PATHS = {
  signIn: '/api/auth/sign-in',
  logout: '/api/auth/logout',
  session: '/api/auth/session',
} as const;

export const CLIENT_BACKEND_PATHS = {
  attributes: '/api/backend/api/v1/attributes',
  attribute: '/api/backend/api/v1/attributes/{id}',
  attributeValues: '/api/backend/api/v1/attributes/{id}/values',
  attributeValuesDelete: '/api/backend/api/v1/attributes/values',
  attributeValue: '/api/backend/api/v1/attributes/values/{id}',
  warehouses: '/api/backend/api/v1/warehouses',
} as const;
