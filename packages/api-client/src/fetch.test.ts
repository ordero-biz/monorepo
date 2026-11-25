import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from './fetch';

describe('apiFetch', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('serializes object bodies as JSON and keeps requests uncached', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          authenticated: true,
        })
      )
    );

    await apiFetch('/api/auth/sign-in', {
      method: 'POST',
      body: {
        email: 'admin@gmail.com',
        password: '123456',
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/auth/sign-in',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'admin@gmail.com',
          password: '123456',
        }),
        cache: 'no-store',
      })
    );

    const [, request] = fetchMock.mock.calls[0] ?? [];
    const headers = new Headers(request?.headers);

    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('preserves non-JSON bodies without forcing a content type', async () => {
    const fetchMock = vi.mocked(fetch);
    const body = new FormData();

    fetchMock.mockResolvedValue(new Response('ok'));
    body.set('file', new Blob(['hello'], { type: 'text/plain' }), 'hello.txt');

    await apiFetch<string>('/api/upload', {
      method: 'POST',
      body,
    });

    const [, request] = fetchMock.mock.calls[0] ?? [];
    const headers = new Headers(request?.headers);

    expect(request).toEqual(
      expect.objectContaining({
        method: 'POST',
        body,
        cache: 'no-store',
      })
    );
    expect(headers.has('Content-Type')).toBe(false);
  });

  it('returns parsed JSON, plain text, and undefined success bodies', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            authenticated: true,
            user: {
              email: 'admin@gmail.com',
            },
          })
        )
      )
      .mockResolvedValueOnce(new Response('plain text body'))
      .mockResolvedValueOnce(new Response(null));

    await expect(apiFetch('/api/auth/session')).resolves.toEqual({
      ok: true,
      data: {
        authenticated: true,
        user: {
          email: 'admin@gmail.com',
        },
      },
    });
    await expect(apiFetch<string>('/api/ping')).resolves.toEqual({
      ok: true,
      data: 'plain text body',
    });
    await expect(apiFetch('/api/logout')).resolves.toEqual({
      ok: true,
      data: undefined,
    });
  });

  it('returns a normalized error when the request throws', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Failed to fetch'));

    await expect(apiFetch('/api/auth/session')).resolves.toEqual({
      ok: false,
      error: {
        status: 500,
        message: 'Failed to fetch',
      },
    });
  });

  it('normalizes JSON error responses with message, code, and field errors', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Sign-in failed.',
          code: 'INVALID_CREDENTIALS',
          fieldErrors: {
            email: 'Use a gmail.com email address.',
          },
        }),
        {
          status: 422,
          statusText: 'Unprocessable Entity',
        }
      )
    );

    await expect(apiFetch('/api/auth/sign-in')).resolves.toEqual({
      ok: false,
      error: {
        status: 422,
        message: 'Sign-in failed.',
        code: 'INVALID_CREDENTIALS',
        fieldErrors: {
          email: 'Use a gmail.com email address.',
        },
      },
    });
  });

  it('ignores invalid fieldErrors shapes in error responses', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Validation failed.',
          fieldErrors: ['email is invalid'],
        }),
        {
          status: 400,
          statusText: 'Bad Request',
        }
      )
    );

    await expect(apiFetch('/api/auth/sign-in')).resolves.toEqual({
      ok: false,
      error: {
        status: 400,
        message: 'Validation failed.',
        code: undefined,
        fieldErrors: undefined,
      },
    });
  });

  it('falls back to response status messages when an error body has no message', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 'AUTH_REQUIRED' }), {
          status: 401,
          statusText: 'Unauthorized',
        })
      )
      .mockResolvedValueOnce(
        new Response(null, {
          status: 500,
          statusText: '',
        })
      );

    await expect(apiFetch('/api/auth/logout')).resolves.toEqual({
      ok: false,
      error: {
        status: 401,
        message: 'Unauthorized',
        code: 'AUTH_REQUIRED',
        fieldErrors: undefined,
      },
    });
    await expect(apiFetch('/api/auth/logout')).resolves.toEqual({
      ok: false,
      error: {
        status: 500,
        message: 'Request failed with status 500.',
        code: undefined,
        fieldErrors: undefined,
      },
    });
  });
});
