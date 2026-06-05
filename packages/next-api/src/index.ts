export type { HasAuthenticatedServerSessionArgs } from './authPageGuard';
export { hasAuthenticatedServerSession } from './authPageGuard';
export type {
  AuthCookieConfig,
  AuthCookieOptions,
  BackendRequestArgs,
  BackendRequestResult,
} from './server';
export {
  AUTH_COOKIE_OPTIONS,
  AUTH_TOKEN_COOKIE_NAME,
  clearAuthCookie,
  fetchBackendData,
  fetchBackendResponse,
  getApiErrorFromResponse,
  getTokenFromRequest,
  setAuthCookie,
} from './server';
export type {
  FetchBackendData,
  ResolveServerSessionArgs,
  ServerSessionResult,
} from './session';
export { resolveServerSession } from './session';
