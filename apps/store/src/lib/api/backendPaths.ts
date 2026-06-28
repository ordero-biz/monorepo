export const BACKEND_AUTH_PATHS = {
  signIn: '/api/v1/employees/sign-in',
  me: '/api/v1/employees/me',
} as const;

export const BACKEND_ATTRIBUTE_PATHS = {
  attribute: '/api/v1/attributes/{id}',
  attributeValues: '/api/v1/attributes/{id}/values',
} as const;
