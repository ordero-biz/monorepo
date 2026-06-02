import {
  getAttribute,
  getAttributes,
  getAttributeValues,
  getSession,
  logout,
  signIn,
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

  it('gets attributes from the backend proxy on success', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          content: [
            {
              id: 1,
              name: 'Size',
              sortOrder: 10,
              createdAt: '2026-05-26T20:55:51.542Z',
            },
          ],
          page: {
            size: 25,
            number: 0,
            totalElements: 1,
            totalPages: 1,
          },
        })
      )
    );

    await expect(getAttributes()).resolves.toEqual({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Size',
            sortOrder: 10,
            createdAt: '2026-05-26T20:55:51.542Z',
          },
        ],
        page: {
          size: 25,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/attributes',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the attributes route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Attributes lookup failed.',
          code: 'ATTRIBUTES_LOOKUP_FAILED',
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
        }
      )
    );

    await expect(getAttributes()).resolves.toEqual({
      ok: false,
      error: {
        status: 503,
        message: 'Attributes lookup failed.',
        code: 'ATTRIBUTES_LOOKUP_FAILED',
        fieldErrors: undefined,
      },
    });
  });

  it('gets a single attribute from the backend proxy on success', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          name: 'Size',
          sortOrder: 10,
          values: ['S', 'M', 'L'],
          createdAt: '2026-05-26T20:55:51.542Z',
        })
      )
    );

    await expect(getAttribute('1')).resolves.toEqual({
      ok: true,
      data: {
        id: 1,
        name: 'Size',
        sortOrder: 10,
        values: ['S', 'M', 'L'],
        createdAt: '2026-05-26T20:55:51.542Z',
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/attributes/1',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the attribute detail route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Attribute detail lookup failed.',
          code: 'ATTRIBUTE_DETAIL_LOOKUP_FAILED',
        }),
        {
          status: 404,
          statusText: 'Not Found',
        }
      )
    );

    await expect(getAttribute('1')).resolves.toEqual({
      ok: false,
      error: {
        status: 404,
        message: 'Attribute detail lookup failed.',
        code: 'ATTRIBUTE_DETAIL_LOOKUP_FAILED',
        fieldErrors: undefined,
      },
    });
  });

  it('gets attribute values from the backend proxy on success', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            name: 'S',
            sortOrder: 0,
          },
          {
            name: 'M',
            sortOrder: 1,
          },
        ])
      )
    );

    await expect(getAttributeValues('1')).resolves.toEqual({
      ok: true,
      data: [
        {
          name: 'S',
          sortOrder: 0,
        },
        {
          name: 'M',
          sortOrder: 1,
        },
      ],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/attributes/1/values',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the attribute values route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Attribute values lookup failed.',
          code: 'ATTRIBUTE_VALUES_LOOKUP_FAILED',
        }),
        {
          status: 404,
          statusText: 'Not Found',
        }
      )
    );

    await expect(getAttributeValues('1')).resolves.toEqual({
      ok: false,
      error: {
        status: 404,
        message: 'Attribute values lookup failed.',
        code: 'ATTRIBUTE_VALUES_LOOKUP_FAILED',
        fieldErrors: undefined,
      },
    });
  });
});
