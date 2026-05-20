import type { NextRequest, NextResponse } from 'next/server';
import {
  AUTH_COOKIE_OPTIONS,
  AUTH_TOKEN_COOKIE_NAME,
} from '@/lib/api/constants';
import type { ApiError, ApiResult, Token } from '@/lib/api/types';

type BackendRequestArgs = {
  path: string;
  init?: RequestInit;
  token?: Token;
  search?: string;
};

type BackendRequestResult =
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const getBackendBaseUrl = () => {
  const backendBaseUrl = process.env.BACKEND_API_URL;

  if (!backendBaseUrl) {
    throw new Error('BACKEND_API_URL is not configured.');
  }

  return backendBaseUrl;
};

const getBackendUrl = ({
  path,
  search,
}: Pick<BackendRequestArgs, 'path' | 'search'>) => {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(
    normalizedPath,
    `${getBackendBaseUrl().replace(/\/$/, '')}/`
  );

  if (search) {
    url.search = search.startsWith('?') ? search.slice(1) : search;
  }

  return url;
};

const readJson = async (response: Response) => {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
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
  const body = await readJson(response);
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

const sendBackendRequest = async ({
  path,
  init,
  token,
  search,
}: BackendRequestArgs): Promise<BackendRequestResult> => {
  let response: Response;

  try {
    const headers = new Headers(init?.headers);

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    response = await fetch(getBackendUrl({ path, search }), {
      ...init,
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

export const backendRequest = async ({
  path,
  init,
  token,
  search,
}: BackendRequestArgs): Promise<ApiResult<Response>> => {
  const requestResult = await sendBackendRequest({
    path,
    init,
    token,
    search,
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

export const backendFetch = async <T>({
  path,
  init,
  token,
  search,
}: BackendRequestArgs): Promise<ApiResult<T>> => {
  const requestResult = await backendRequest({
    path,
    init,
    token,
    search,
  });

  if (!requestResult.ok) {
    return requestResult;
  }

  return {
    ok: true,
    data: (await readJson(requestResult.data)) as T,
  };
};

export const getTokenFromRequest = (request: NextRequest): Token | undefined =>
  request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;

export const setAuthCookie = (response: NextResponse, token: Token) => {
  response.cookies.set({
    ...AUTH_COOKIE_OPTIONS,
    name: AUTH_TOKEN_COOKIE_NAME,
    value: token,
  });
};

export const clearAuthCookie = (response: NextResponse) => {
  response.cookies.set({
    ...AUTH_COOKIE_OPTIONS,
    name: AUTH_TOKEN_COOKIE_NAME,
    value: '',
    maxAge: 0,
  });
};
