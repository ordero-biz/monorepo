export const CLIENT_AUTH_PATHS = {
  signIn: '/api/auth/sign-in',
  logout: '/api/auth/logout',
  session: '/api/auth/session',
} as const;

export const CLIENT_BACKEND_PATHS = {
  attributes: '/api/backend/api/v1/attributes',
} as const;
