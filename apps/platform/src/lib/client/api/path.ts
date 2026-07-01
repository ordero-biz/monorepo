export const CLIENT_AUTH_PATHS = {
  signIn: '/api/auth/sign-in',
  logout: '/api/auth/logout',
  session: '/api/auth/session',
  signUp: '/api/auth/sign-up',
} as const;

export const CLIENT_BACKEND_PATHS = {
  stores: '/api/backend/api/v1/platform/enterprise',
} as const;
