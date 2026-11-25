import type { ApiError, ApiResult, Token } from '@ordero/api-types';
import type { NextRequest, NextResponse } from 'next/server';

export const AUTH_TOKEN_COOKIE_NAME = 'ordero_access_token';

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
} as const;

export type AuthCookieOptions = Partial<{
  httpOnly: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  secure: boolean;
  path: string;
  maxAge: number;
}>;

export type AuthCookieConfig = {
  name?: string;
  options?: AuthCookieOptions;
};

export type BackendRequestArgs = {
  path: string;
  init?: RequestInit;
  token?: Token;
  search?: string;
  backendBaseUrl?: string;
  forwardedHeadersNames?: ForwardedHeadersNames;
};

export type BackendRequestResult =
  | {
      ok: true;
      response: Response;
    }
  | {
      ok: false;
      error: ApiError;
    };

type BackendErrorBody = {
  message?: unknown;
  error?: unknown;
  code?: unknown;
  fieldErrors?: unknown;
};

type RequestInitWithDuplex = RequestInit & {
  duplex?: 'half';
};

export const FORWARDED_HEADER_NAMES = new Set([
  'accept',
  'content-type',
  'origin',
]);

export type ForwardedHeadersNames = ReadonlySet<string>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export const getForwardHeaders = (
  sourceHeaders: HeadersInit,
  forwardedHeadersNames: ForwardedHeadersNames = FORWARDED_HEADER_NAMES
) => {
  const headers = new Headers();

  for (const [key, value] of new Headers(sourceHeaders).entries()) {
    if (forwardedHeadersNames.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  }

  return headers;
};

const withOptionalDuplex = (init?: RequestInit): RequestInitWithDuplex => {
  if (!(init?.body instanceof ReadableStream)) {
    return { ...init };
  }

  return {
    ...init,
    duplex: 'half',
  };
};

const getBackendBaseUrl = (backendBaseUrl?: string) => {
  const resolvedBackendBaseUrl = backendBaseUrl ?? process.env.BACKEND_API_URL;

  if (!resolvedBackendBaseUrl) {
    throw new Error('BACKEND_API_URL is not configured.');
  }

  return resolvedBackendBaseUrl;
};

const getBackendUrl = ({
  path,
  search,
  backendBaseUrl,
}: Pick<BackendRequestArgs, 'backendBaseUrl' | 'path' | 'search'>) => {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(
    normalizedPath,
    `${getBackendBaseUrl(backendBaseUrl).replace(/\/$/, '')}/`
  );

  if (search) {
    url.search = search.startsWith('?') ? search.slice(1) : search;
  }

  return url;
};

const normalizeFieldErrors = (fieldErrors: unknown) => {
  if (!isRecord(fieldErrors)) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(fieldErrors).flatMap(([key, value]) =>
      typeof value === 'string' ? [[key, value]] : []
    )
  );
};

const getMessageFromBody = (body: unknown, fallback: string) => {
  if (!isRecord(body)) {
    return fallback;
  }

  const errorBody = body as BackendErrorBody;

  if (typeof errorBody.message === 'string') {
    return errorBody.message;
  }

  if (typeof errorBody.error === 'string') {
    return errorBody.error;
  }

  return fallback;
};

export const getApiErrorFromResponse = async (
  response: Response
): Promise<ApiError> => {
  const body = await parseBackendResponseData<unknown>(response);
  const fallbackMessage =
    response.statusText || `Request failed with status ${response.status}.`;

  return {
    status: response.status,
    message: getMessageFromBody(body, fallbackMessage),
    code:
      isRecord(body) && typeof body.code === 'string' ? body.code : undefined,
    fieldErrors:
      isRecord(body) && 'fieldErrors' in body
        ? normalizeFieldErrors(body.fieldErrors)
        : undefined,
  };
};

export const parseBackendResponseData = async <T>(
  response: Response
): Promise<T> => {
  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
};

const sendBackendRequest = async ({
  path,
  init,
  token,
  search,
  backendBaseUrl,
  forwardedHeadersNames,
}: BackendRequestArgs): Promise<BackendRequestResult> => {
  let response: Response;

  try {
    const headers = getForwardHeaders(
      init?.headers ?? {},
      forwardedHeadersNames
    );

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    response = await fetch(getBackendUrl({ path, search, backendBaseUrl }), {
      ...withOptionalDuplex(init),
      headers,
      cache: 'no-store',
    });
  } catch (error) {
    return {
      ok: false,
      error: {
        status: 500,
        message:
          error instanceof Error ? error.message : 'Unable to reach backend.',
      },
    } as const;
  }

  return {
    ok: true,
    response,
  } as const;
};

export const fetchBackendResponse = async ({
  path,
  init,
  token,
  search,
  backendBaseUrl,
  forwardedHeadersNames,
}: BackendRequestArgs): Promise<ApiResult<Response>> => {
  const requestResult = await sendBackendRequest({
    path,
    init,
    token,
    search,
    backendBaseUrl,
    forwardedHeadersNames,
  });

  if (!requestResult.ok) {
    return requestResult;
  }

  if (!requestResult.response.ok) {
    return {
      ok: false,
      error: await getApiErrorFromResponse(requestResult.response),
    };
  }

  return {
    ok: true,
    data: requestResult.response,
  };
};

export const getTokenFromRequest = (
  request: NextRequest,
  cookieName = AUTH_TOKEN_COOKIE_NAME
): Token | undefined => request.cookies.get(cookieName)?.value;

export const setAuthCookie = (
  response: NextResponse,
  token: Token,
  config: AuthCookieConfig = {}
) => {
  response.cookies.set({
    ...AUTH_COOKIE_OPTIONS,
    ...config.options,
    name: config.name ?? AUTH_TOKEN_COOKIE_NAME,
    value: token,
  });
};

export const clearAuthCookie = (
  response: NextResponse,
  config: AuthCookieConfig = {}
) => {
  response.cookies.set({
    ...AUTH_COOKIE_OPTIONS,
    ...config.options,
    name: config.name ?? AUTH_TOKEN_COOKIE_NAME,
    value: '',
    maxAge: 0,
  });
};
