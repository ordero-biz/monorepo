'use client';

import { CLIENT_AUTH_PATHS } from '@/lib/api/constants';
import type {
  ApiError,
  ApiResult,
  AuthSession,
  AuthSignInInput,
  AuthSignUpInput,
} from '@/lib/api/types';

type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | Record<string, unknown>;
};

const isJsonObjectBody = (
  body: ApiFetchOptions['body']
): body is Record<string, unknown> =>
  Boolean(body) &&
  typeof body === 'object' &&
  !(body instanceof FormData) &&
  !(body instanceof Blob) &&
  !(body instanceof URLSearchParams) &&
  !(body instanceof ArrayBuffer) &&
  !ArrayBuffer.isView(body);

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
  const body = isJsonObjectBody(options.body)
    ? JSON.stringify(options.body)
    : options.body;

  if (isJsonObjectBody(options.body) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;

  try {
    response = await fetch(path, {
      ...options,
      body,
      headers,
      cache: 'no-store',
    });
  } catch (error) {
    return {
      ok: false,
      error: {
        status: 500,
        message:
          error instanceof Error
            ? error.message
            : 'Unable to complete request.',
      },
    };
  }

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

export const signIn = (input: AuthSignInInput) =>
  apiFetch<AuthSession>(CLIENT_AUTH_PATHS.signIn, {
    method: 'POST',
    body: input,
  });

export const signUp = (input: AuthSignUpInput) =>
  apiFetch<AuthSession>(CLIENT_AUTH_PATHS.signUp, {
    method: 'POST',
    body: input,
  });

export const logout = () =>
  apiFetch<AuthSession>(CLIENT_AUTH_PATHS.logout, {
    method: 'POST',
  });

export const getSession = () =>
  apiFetch<AuthSession>(CLIENT_AUTH_PATHS.session, {
    method: 'GET',
  });
