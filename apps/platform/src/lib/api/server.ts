import {
  FORWARDED_HEADER_NAMES,
  fetchBackendResponse as fetchSharedBackendResponse,
} from '@ordero/next-api/server';
import type { BackendRequestArgs as SharedBackendRequestArgs } from '@ordero/next-api/server';

export type {
  AuthCookieConfig,
  AuthCookieOptions,
  BackendRequestArgs,
  BackendRequestResult,
  ForwardedHeadersNames,
} from '@ordero/next-api/server';
export {
  clearAuthCookie,
  FORWARDED_HEADER_NAMES,
  getApiErrorFromResponse,
  getForwardHeaders,
  getTokenFromRequest,
  parseBackendResponseData,
  setAuthCookie,
} from '@ordero/next-api/server';

const PLATFORM_FORWARDED_HEADERS_NAMES = FORWARDED_HEADER_NAMES;

type PlatformBackendRequestArgs = Omit<
  SharedBackendRequestArgs,
  'forwardedHeadersNames'
>;

export const fetchBackendResponse = (args: PlatformBackendRequestArgs) =>
  fetchSharedBackendResponse({
    ...args,
    forwardedHeadersNames: PLATFORM_FORWARDED_HEADERS_NAMES,
  });
