import {
  createStore,
  getSession,
  getStores,
  logout,
  signIn,
  signUp,
} from './api';

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
          user: {
            email: 'new-user@gmail.com',
          },
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
        user: {
          email: 'new-user@gmail.com',
        },
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

  it('getStores reads the current owner stores through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 1,
            name: 'North Shop',
            subDomain: 'north-shop',
          },
        ])
      )
    );

    await expect(getStores()).resolves.toEqual({
      ok: true,
      data: [
        {
          id: 1,
          name: 'North Shop',
          subDomain: 'north-shop',
        },
      ],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/platform/enterprise',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it('createStore posts the swagger create-enterprise payload through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          name: 'North Shop',
          subDomain: 'north-shop',
        })
      )
    );

    await expect(
      createStore({
        name: 'North Shop',
        subDomain: 'north-shop',
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        id: 1,
        name: 'North Shop',
        subDomain: 'north-shop',
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/platform/enterprise',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'North Shop',
          subDomain: 'north-shop',
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
