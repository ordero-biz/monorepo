'use client';

import type {
  ApiError,
  ApiResult,
  AuthLoginInput,
  AuthSession,
} from '@/lib/api/types';

type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | Record<string, unknown>;
};

const getResponseBody = async (response: Response) => {
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

const getApiError = async (response: Response): Promise<ApiError> => {
  const body = await getResponseBody(response);
  const fieldErrors =
    body &&
    typeof body === 'object' &&
    'fieldErrors' in body &&
    body.fieldErrors &&
    typeof body.fieldErrors === 'object' &&
    !Array.isArray(body.fieldErrors)
      ? (body.fieldErrors as Record<string, string>)
      : undefined;

  return {
    status: response.status,
    message:
      body &&
      typeof body === 'object' &&
      'message' in body &&
      typeof body.message === 'string'
        ? body.message
        : response.statusText ||
          `Request failed with status ${response.status}.`,
    code:
      body &&
      typeof body === 'object' &&
      'code' in body &&
      typeof body.code === 'string'
        ? body.code
        : undefined,
    fieldErrors,
  };
};

export const apiFetch = async <T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<ApiResult<T>> => {
  const headers = new Headers(options.headers);
  const body =
    options.body &&
    typeof options.body === 'object' &&
    !(options.body instanceof FormData) &&
    !(options.body instanceof Blob) &&
    !(options.body instanceof URLSearchParams)
      ? JSON.stringify(options.body)
      : options.body;

  if (body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(path, {
    ...options,
    body,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    return {
      ok: false,
      error: await getApiError(response),
    };
  }

  return {
    ok: true,
    data: (await getResponseBody(response)) as T,
  };
};

export const login = (input: AuthLoginInput) =>
  apiFetch<AuthSession>('/api/auth/login', {
    method: 'POST',
    body: input,
  });

export const logout = () =>
  apiFetch<AuthSession>('/api/auth/logout', {
    method: 'POST',
  });

export const getSession = () =>
  apiFetch<AuthSession>('/api/auth/session', {
    method: 'GET',
  });
