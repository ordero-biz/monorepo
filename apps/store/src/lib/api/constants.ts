export const AUTH_TOKEN_COOKIE_NAME = 'ordero_access_token';

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
} as const;

export const BACKEND_AUTH_PATHS = {
  signIn: '/api/v1/employees/sign-in',
  logout: '/auth/logout',
  me: '/api/v1/employees/me',
} as const;

export const CLIENT_AUTH_PATHS = {
  signIn: '/api/auth/sign-in',
  logout: '/api/auth/logout',
  session: '/api/auth/session',
} as const;

export const BACKEND_ATTRIBUTE_PATHS = {
  getAttributes: '/api/backend/api/v1/attributes',
  postAttribute: '/api/backend/api/v1/attributes',
  getAttribute: (attributeId: string | number) =>
    `/api/backend/api/v1/attributes/${attributeId}`,
  getAttributeValues: (attributeId: string | number) =>
    `/api/backend/api/v1/attributes/${attributeId}/values`,
} as const;
