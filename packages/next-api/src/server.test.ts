import { NextRequest, NextResponse } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AUTH_TOKEN_COOKIE_NAME,
  clearAuthCookie,
  fetchBackendResponse,
  getApiErrorFromResponse,
  getForwardHeaders,
  getTokenFromRequest,
  parseBackendResponseData,
  setAuthCookie,
} from './server';

const backendApiUrl = 'https://backend.example.test/base/';

describe('getApiErrorFromResponse', () => {
  it('prefers backend message fields and keeps only string field errors', async () => {
    const response = new Response(
      JSON.stringify({
        message: 'Validation failed.',
        code: 'INVALID_INPUT',
        fieldErrors: {
          email: 'Use a gmail.com email address.',
          password: 123,
        },
      }),
      {
        status: 422,
        statusText: 'Unprocessable Entity',
      }
    );

    await expect(getApiErrorFromResponse(response)).resolves.toEqual({
      status: 422,
      message: 'Validation failed.',
      code: 'INVALID_INPUT',
      fieldErrors: {
        email: 'Use a gmail.com email address.',
      },
    });
  });

  it('falls back to the error field, status text, and default message', async () => {
    const errorFieldResponse = new Response(
      JSON.stringify({
        error: 'Backend unavailable.',
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
      }
    );
    const statusTextResponse = new Response('plain text body', {
      status: 502,
      statusText: 'Bad Gateway',
    });
    const defaultResponse = new Response(null, {
      status: 500,
      statusText: '',
    });

    await expect(getApiErrorFromResponse(errorFieldResponse)).resolves.toEqual({
      status: 503,
      message: 'Backend unavailable.',
      code: undefined,
      fieldErrors: undefined,
    });
    await expect(getApiErrorFromResponse(statusTextResponse)).resolves.toEqual({
      status: 502,
      message: 'Bad Gateway',
      code: undefined,
      fieldErrors: undefined,
    });
    await expect(getApiErrorFromResponse(defaultResponse)).resolves.toEqual({
      status: 500,
      message: 'Request failed with status 500.',
      code: undefined,
      fieldErrors: undefined,
    });
  });
});

describe('backend request helpers', () => {
  beforeEach(() => {
    process.env.BACKEND_API_URL = backendApiUrl;
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.BACKEND_API_URL;
  });

  it('builds backend URLs, forwards search params, and adds the Bearer token', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [],
        })
      )
    );

    const result = await fetchBackendResponse({
      path: '/orders',
      search: '?status=open',
      token: 'jwt-token',
      init: {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      },
    });

    expect(result).toEqual({
      ok: true,
      data: expect.any(Response),
    });
    expect(fetchMock.mock.calls[0]?.[0].toString()).toBe(
      'https://backend.example.test/base/orders?status=open'
    );

    const [, request] = fetchMock.mock.calls[0] ?? [];
    const headers = new Headers(request?.headers);

    expect(request).toEqual(
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
    expect(headers.get('Authorization')).toBe('Bearer jwt-token');
    expect(headers.get('accept')).toBe('application/json');
  });

  it('sets duplex for streamed request bodies', async () => {
    const body = new ReadableStream();

    vi.mocked(fetch).mockResolvedValue(new Response('{}'));

    await fetchBackendResponse({
      path: '/orders',
      init: {
        method: 'POST',
        body,
      },
    });

    const [, request] = vi.mocked(fetch).mock.calls[0] ?? [];

    expect(request).toEqual(
      expect.objectContaining({
        body,
        duplex: 'half',
      })
    );
  });

  it('filters forwarded proxy headers when a header source is provided', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('{}'));

    await fetchBackendResponse({
      path: '/orders',
      token: 'jwt-token',
      forwardHeadersFrom: {
        headers: new Headers({
          accept: 'application/json',
          authorization: 'Bearer browser-token',
          'content-type': 'application/json',
          cookie: 'ordero_access_token=browser-cookie',
          origin: 'https://store.example.test',
        }),
      },
    });

    const [, request] = vi.mocked(fetch).mock.calls[0] ?? [];
    const headers = new Headers(request?.headers);

    expect(Object.fromEntries(headers.entries())).toEqual({
      accept: 'application/json',
      authorization: 'Bearer jwt-token',
      'content-type': 'application/json',
      origin: 'https://store.example.test',
    });
  });

  it('uses custom forwarded proxy header names when provided', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('{}'));

    await fetchBackendResponse({
      path: '/orders',
      forwardHeadersFrom: {
        headers: new Headers({
          accept: 'application/json',
          origin: 'https://store.example.test',
          'x-tenant-id': 'tenant-1',
        }),
      },
      forwardedHeadersNames: new Set(['origin', 'x-tenant-id']),
    });

    const [, request] = vi.mocked(fetch).mock.calls[0] ?? [];
    const headers = new Headers(request?.headers);

    expect(Object.fromEntries(headers.entries())).toEqual({
      origin: 'https://store.example.test',
      'x-tenant-id': 'tenant-1',
    });
  });

  it('returns normalized errors for thrown requests and unsuccessful responses', async () => {
    vi.mocked(fetch)
      .mockRejectedValueOnce(new Error('connect ECONNREFUSED'))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            message: 'Token expired.',
            code: 'TOKEN_EXPIRED',
          }),
          {
            status: 401,
            statusText: 'Unauthorized',
          }
        )
      );

    await expect(
      fetchBackendResponse({
        path: '/orders',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        status: 500,
        message: 'connect ECONNREFUSED',
      },
    });
    await expect(
      fetchBackendResponse({
        path: 'orders',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        status: 401,
        message: 'Token expired.',
        code: 'TOKEN_EXPIRED',
        fieldErrors: undefined,
      },
    });
  });

  it('uses the explicit backend base URL when provided', async () => {
    delete process.env.BACKEND_API_URL;
    vi.mocked(fetch).mockResolvedValue(new Response('{}'));

    await fetchBackendResponse({
      backendBaseUrl: 'https://override.example.test',
      path: '/health',
    });

    expect(vi.mocked(fetch).mock.calls[0]?.[0].toString()).toBe(
      'https://override.example.test/health'
    );
  });

  it('normalizes a missing BACKEND_API_URL as a backend error', async () => {
    delete process.env.BACKEND_API_URL;
    vi.mocked(fetch).mockResolvedValue(new Response('{}'));

    await expect(
      fetchBackendResponse({
        path: '/orders',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        status: 500,
        message: 'BACKEND_API_URL is not configured.',
      },
    });
  });
});

describe('parseBackendResponseData', () => {
  it('returns parsed JSON and plain text backend data', async () => {
    await expect(
      parseBackendResponseData<{ id: string }>(
        new Response(
          JSON.stringify({
            id: 'order-1',
          })
        )
      )
    ).resolves.toEqual({
      id: 'order-1',
    });
    await expect(
      parseBackendResponseData<string>(new Response('plain text body'))
    ).resolves.toBe('plain text body');
  });
});

describe('getForwardHeaders', () => {
  it('keeps only backend proxy headers with case-insensitive matching', () => {
    const headers = getForwardHeaders({
      headers: new Headers({
        accept: 'application/json',
        authorization: 'Bearer browser-token',
        'content-type': 'application/json',
        cookie: 'ordero_access_token=browser-cookie',
        Origin: 'https://store.example.test',
        referer: 'https://store.example.test/orders',
      }),
    });

    expect(Object.fromEntries(headers.entries())).toEqual({
      accept: 'application/json',
      'content-type': 'application/json',
      origin: 'https://store.example.test',
    });
  });

  it('uses custom forwarded header names with case-insensitive matching', () => {
    const headers = getForwardHeaders(
      {
        headers: new Headers({
          accept: 'application/json',
          origin: 'https://store.example.test',
          'x-tenant-id': 'tenant-1',
        }),
      },
      new Set(['origin', 'x-tenant-id'])
    );

    expect(Object.fromEntries(headers.entries())).toEqual({
      origin: 'https://store.example.test',
      'x-tenant-id': 'tenant-1',
    });
  });
});

describe('auth cookie helpers', () => {
  it('reads the auth token from the default request cookie', () => {
    const request = new NextRequest('http://localhost/api/auth/session', {
      headers: {
        cookie: `${AUTH_TOKEN_COOKIE_NAME}=jwt-token`,
      },
    });

    expect(getTokenFromRequest(request)).toBe('jwt-token');
  });

  it('supports custom cookie names', () => {
    const request = new NextRequest('http://localhost/api/auth/session', {
      headers: {
        cookie: 'custom_auth=custom-token',
      },
    });
    const response = NextResponse.json({
      ok: true,
    });

    expect(getTokenFromRequest(request, 'custom_auth')).toBe('custom-token');

    setAuthCookie(response, 'custom-token', {
      name: 'custom_auth',
      options: {
        path: '/admin',
      },
    });
    expect(response.headers.get('set-cookie')).toContain(
      'custom_auth=custom-token'
    );
    expect(response.headers.get('set-cookie')).toContain('Path=/admin');
  });

  it('stores and clears the auth token as an HttpOnly cookie', () => {
    const setResponse = NextResponse.json({
      ok: true,
    });
    const clearResponse = NextResponse.json({
      ok: true,
    });

    setAuthCookie(setResponse, 'jwt-token');
    clearAuthCookie(clearResponse);

    expect(setResponse.headers.get('set-cookie')).toContain(
      `${AUTH_TOKEN_COOKIE_NAME}=jwt-token`
    );
    expect(setResponse.headers.get('set-cookie')).toContain('HttpOnly');
    expect(setResponse.headers.get('set-cookie')).toContain('Path=/');
    expect(clearResponse.headers.get('set-cookie')).toContain(
      `${AUTH_TOKEN_COOKIE_NAME}=`
    );
    expect(clearResponse.headers.get('set-cookie')).toContain('Max-Age=0');
    expect(clearResponse.headers.get('set-cookie')).toContain('HttpOnly');
  });
});
