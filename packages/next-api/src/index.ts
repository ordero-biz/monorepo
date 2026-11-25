export type { HasAuthenticatedServerSessionArgs } from './authPageGuard';
export { hasAuthenticatedServerSession } from './authPageGuard';
export type {
  AuthCookieConfig,
  AuthCookieOptions,
  BackendRequestArgs,
  BackendRequestResult,
  ForwardedHeadersNames,
} from './server';
export {
  AUTH_COOKIE_OPTIONS,
  AUTH_TOKEN_COOKIE_NAME,
  clearAuthCookie,
  FORWARDED_HEADER_NAMES,
  fetchBackendResponse,
  getApiErrorFromResponse,
  getForwardHeaders,
  getTokenFromRequest,
  parseBackendResponseData,
  setAuthCookie,
} from './server';
export type {
  FetchBackendResponse,
  ResolveServerSessionArgs,
  ServerSessionResult,
} from './session';
export { resolveServerSession } from './session';
