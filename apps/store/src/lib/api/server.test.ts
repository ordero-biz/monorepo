import { NextRequest, NextResponse } from 'next/server';
import { AUTH_TOKEN_COOKIE_NAME } from '@/lib/api/constants';
import {
  backendFetch,
  backendRequest,
  clearAuthCookie,
  getApiErrorFromResponse,
  getTokenFromRequest,
  setAuthCookie,
} from './server';

const backendApiUrl = 'https://backend.example.test/base/';

describe('getApiErrorFromResponse', () => {
  it('prefers the message field and keeps only string field errors', async () => {
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

  it('falls back to the error field and then the response status text', async () => {
    const errorFieldResponse = new Response(
      JSON.stringify({
        error: 'Backend unavailable.',
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
      }
    );

    const fallbackResponse = new Response('plain text body', {
      status: 502,
      statusText: 'Bad Gateway',
    });

    await expect(getApiErrorFromResponse(errorFieldResponse)).resolves.toEqual({
      status: 503,
      message: 'Backend unavailable.',
      code: undefined,
      fieldErrors: undefined,
    });
    await expect(getApiErrorFromResponse(fallbackResponse)).resolves.toEqual({
      status: 502,
      message: 'Bad Gateway',
      code: undefined,
      fieldErrors: undefined,
    });
  });

  it('falls back to the default message when the response has no body or status text', async () => {
    const response = new Response(null, {
      status: 500,
      statusText: '',
    });

    await expect(getApiErrorFromResponse(response)).resolves.toEqual({
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

  it('builds the backend URL, forwards search params, and adds the Bearer token', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [],
        })
      )
    );

    const result = await backendRequest({
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

  it('returns a normalized error when the backend request throws', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('connect ECONNREFUSED'));

    await expect(
      backendRequest({
        path: '/orders',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        status: 500,
        message: 'connect ECONNREFUSED',
      },
    });
  });

  it('returns normalized backend errors for unsuccessful responses', async () => {
    vi.mocked(fetch).mockResolvedValue(
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
      backendRequest({
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

  it('throws when BACKEND_API_URL is not configured', async () => {
    delete process.env.BACKEND_API_URL;
    vi.mocked(fetch).mockResolvedValue(new Response('{}'));

    await expect(
      backendRequest({
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

  it('returns parsed backend JSON data from backendFetch', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 'order-1',
        })
      )
    );

    await expect(
      backendFetch<{ id: string }>({
        path: '/orders/order-1',
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        id: 'order-1',
      },
    });
  });

  it('returns plain text backend data from backendFetch when JSON parsing fails', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('plain text body'));

    await expect(
      backendFetch<string>({
        path: '/health',
      })
    ).resolves.toEqual({
      ok: true,
      data: 'plain text body',
    });
  });
});

describe('auth cookie helpers', () => {
  it('reads the auth token from the request cookie', () => {
    const request = new NextRequest('http://localhost/api/auth/session', {
      headers: {
        cookie: `${AUTH_TOKEN_COOKIE_NAME}=jwt-token`,
      },
    });

    expect(getTokenFromRequest(request)).toBe('jwt-token');
  });

  it('stores the auth token in an HttpOnly cookie', () => {
    const response = NextResponse.json({
      ok: true,
    });

    setAuthCookie(response, 'jwt-token');

    expect(response.headers.get('set-cookie')).toContain(
      `${AUTH_TOKEN_COOKIE_NAME}=jwt-token`
    );
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    expect(response.headers.get('set-cookie')).toContain('Path=/');
  });

  it('clears the auth token cookie', () => {
    const response = NextResponse.json({
      ok: true,
    });

    clearAuthCookie(response);

    expect(response.headers.get('set-cookie')).toContain(
      `${AUTH_TOKEN_COOKIE_NAME}=`
    );
    expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
  });
});
