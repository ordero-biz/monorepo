export const AUTH_TOKEN_COOKIE_NAME = 'ordero_access_token';

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
} as const;

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
