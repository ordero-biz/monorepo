import { apiFetch, getSession, logout, signIn, signUp } from './client';

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

  it('returns plain text for successful non-JSON responses', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('plain text body'));

    await expect(apiFetch<string>('/api/ping')).resolves.toEqual({
      ok: true,
      data: 'plain text body',
    });
  });

  it('returns undefined for successful empty responses', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null));

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

  it('falls back to the default status message when an error response has no body or status text', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(null, {
        status: 500,
        statusText: '',
      })
    );

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

  it('uses plain text error bodies only when they are the status text fallback source', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response('Backend exploded', {
        status: 502,
        statusText: 'Bad Gateway',
      })
    );

    await expect(apiFetch('/api/backend/orders')).resolves.toEqual({
      ok: false,
      error: {
        status: 502,
        message: 'Bad Gateway',
        code: undefined,
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

  it('signIn returns normalized failures from the sign-in route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Sign-in failed.',
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

    await expect(
      signIn({
        email: 'admin@mail.com',
        password: '123456',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        status: 422,
        message: 'Sign-in failed.',
        code: undefined,
        fieldErrors: {
          email: 'Use a gmail.com email address.',
        },
      },
    });
  });

  it('signUp posts credentials to the sign-up route and returns the session on success', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          authenticated: true,
        })
      )
    );

    await expect(
      signUp({
        email: 'new-user@gmail.com',
        password: 'securePassword1',
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        authenticated: true,
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/auth/sign-up',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'new-user@gmail.com',
          password: 'securePassword1',
        }),
        cache: 'no-store',
      })
    );
  });

  it('signUp returns normalized failures from the sign-up route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Sign-up failed.',
          fieldErrors: {
            email: 'This email is already registered.',
          },
        }),
        {
          status: 409,
          statusText: 'Conflict',
        }
      )
    );

    await expect(
      signUp({
        email: 'existing@gmail.com',
        password: 'securePassword1',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        status: 409,
        message: 'Sign-up failed.',
        code: undefined,
        fieldErrors: {
          email: 'This email is already registered.',
        },
      },
    });
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

  it('logout returns normalized failures from the logout route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Logout failed.',
          code: 'LOGOUT_FAILED',
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
        }
      )
    );

    await expect(logout()).resolves.toEqual({
      ok: false,
      error: {
        status: 503,
        message: 'Logout failed.',
        code: 'LOGOUT_FAILED',
        fieldErrors: undefined,
      },
    });
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

  it('returns normalized failures from the session route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Session lookup failed.',
          code: 'SESSION_LOOKUP_FAILED',
        }),
        {
          status: 500,
          statusText: 'Internal Server Error',
        }
      )
    );

    await expect(getSession()).resolves.toEqual({
      ok: false,
      error: {
        status: 500,
        message: 'Session lookup failed.',
        code: 'SESSION_LOOKUP_FAILED',
        fieldErrors: undefined,
      },
    });
  });
});
