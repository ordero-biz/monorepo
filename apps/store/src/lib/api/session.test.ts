import { backendFetch } from '@/lib/api/server';
import { getServerSession } from './session';

vi.mock('@/lib/api/server', async () => ({
  ...(await vi.importActual<typeof import('@/lib/api/server')>(
    '@/lib/api/server'
  )),
  backendFetch: vi.fn(),
}));

const backendFetchMock = vi.mocked(backendFetch);

describe('getServerSession', () => {
  beforeEach(() => {
    backendFetchMock.mockReset();
  });

  it('returns a signed-out session when there is no token', async () => {
    await expect(getServerSession()).resolves.toStrictEqual({
      ok: true,
      session: {
        authenticated: false,
      },
      shouldClearAuthCookie: false,
    });
    expect(backendFetchMock).not.toHaveBeenCalled();
  });

  it('returns an authenticated session when the backend accepts the token', async () => {
    backendFetchMock.mockResolvedValue({
      ok: true,
      data: {
        email: 'admin@gmail.com',
      },
    });

    await expect(getServerSession('jwt-token')).resolves.toStrictEqual({
      ok: true,
      session: {
        authenticated: true,
        user: {
          email: 'admin@gmail.com',
        },
      },
      shouldClearAuthCookie: false,
    });
    expect(backendFetchMock).toHaveBeenCalledWith({
      path: '/me',
      init: {
        method: 'GET',
      },
      token: 'jwt-token',
    });
  });

  it('returns a signed-out session and marks the cookie for clearing on 401', async () => {
    backendFetchMock.mockResolvedValue({
      ok: false,
      error: {
        status: 401,
        message: 'Unauthorized',
      },
    });

    await expect(getServerSession('stale-token')).resolves.toStrictEqual({
      ok: true,
      session: {
        authenticated: false,
      },
      shouldClearAuthCookie: true,
    });
  });

  it('returns non-auth backend errors unchanged', async () => {
    backendFetchMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Backend unavailable',
      },
    });

    await expect(getServerSession('jwt-token')).resolves.toStrictEqual({
      ok: false,
      error: {
        status: 500,
        message: 'Backend unavailable',
      },
      shouldClearAuthCookie: false,
    });
  });
});
