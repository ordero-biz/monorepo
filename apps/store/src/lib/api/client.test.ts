import { apiFetch, getSession, logout, signIn } from './client';

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

  it('preserves explicit content type headers for non-JSON bodies', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(new Response('ok'));

    const body = new URLSearchParams({
      email: 'admin@gmail.com',
    });

    await apiFetch<string>('/api/upload', {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
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
    expect(headers.get('Content-Type')).toBe(
      'application/x-www-form-urlencoded'
    );
  });

  it('does not force a JSON content type for FormData bodies', async () => {
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

  it('returns parsed JSON data for successful responses', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          authenticated: true,
          user: {
            email: 'admin@gmail.com',
          },
        })
      )
    );

    await expect(apiFetch('/api/auth/session')).resolves.toEqual({
      ok: true,
      data: {
        authenticated: true,
        user: {
          email: 'admin@gmail.com',
        },
      },
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

  it('falls back to the response status text when an error body has no message', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ code: 'AUTH_REQUIRED' }), {
        status: 401,
        statusText: 'Unauthorized',
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
  });
});

describe('client auth helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('signIn posts credentials to the sign-in route and returns the session on success', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          authenticated: true,
          user: {
            email: 'admin@gmail.com',
          },
        })
      )
    );

    await expect(
      signIn({
        email: 'admin@gmail.com',
        password: '123456',
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        authenticated: true,
        user: {
          email: 'admin@gmail.com',
        },
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
  });

  it('logout posts to the logout route and returns a signed-out session on success', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          authenticated: false,
        })
      )
    );

    await expect(logout()).resolves.toEqual({
      ok: true,
      data: {
        authenticated: false,
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/auth/logout',
      expect.objectContaining({
        method: 'POST',
        cache: 'no-store',
      })
    );
  });

  it('gets the current session from the session route on success', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          authenticated: true,
          user: {
            email: 'admin@gmail.com',
          },
        })
      )
    );

    await expect(getSession()).resolves.toEqual({
      ok: true,
      data: {
        authenticated: true,
        user: {
          email: 'admin@gmail.com',
        },
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/auth/session',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });
});
