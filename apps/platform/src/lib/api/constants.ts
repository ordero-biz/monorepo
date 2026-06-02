export {
  AUTH_COOKIE_OPTIONS,
  AUTH_TOKEN_COOKIE_NAME,
} from '@ordero/next-api/server';

export const BACKEND_AUTH_PATHS = {
  signIn: '/api/v1/platform/owners/login',
  logout: '/auth/logout',
  me: '/me',
  signUp: '/api/v1/platform/owners/sign-up',
} as const;

export const CLIENT_AUTH_PATHS = {
  signIn: '/api/auth/sign-in',
  logout: '/api/auth/logout',
  session: '/api/auth/session',
  signUp: '/api/auth/sign-up',
} as const;

export const CLIENT_BACKEND_PATHS = {
  stores: '/api/backend/api/v1/platform/enterprise',
} as const;
