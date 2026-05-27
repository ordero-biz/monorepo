import { fetchBackendData } from '@/lib/api/server';
import { getServerSession } from './session';

vi.mock('@/lib/api/server', async () => ({
  ...(await vi.importActual<typeof import('@/lib/api/server')>(
    '@/lib/api/server'
  )),
  fetchBackendData: vi.fn(),
}));

const fetchBackendDataMock = vi.mocked(fetchBackendData);

describe('getServerSession', () => {
  beforeEach(() => {
    fetchBackendDataMock.mockReset();
  });

  it('returns a signed-out session when there is no token', async () => {
    await expect(getServerSession()).resolves.toStrictEqual({
      ok: true,
      session: {
        authenticated: false,
      },
      shouldClearAuthCookie: false,
    });
    expect(fetchBackendDataMock).not.toHaveBeenCalled();
  });

  it('returns an authenticated session when the backend accepts the token', async () => {
    fetchBackendDataMock.mockResolvedValue({
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
    expect(fetchBackendDataMock).toHaveBeenCalledWith({
      path: '/me',
      init: {
        method: 'GET',
      },
      token: 'jwt-token',
    });
  });

  it('returns a signed-out session and marks the cookie for clearing on 401', async () => {
    fetchBackendDataMock.mockResolvedValue({
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
    fetchBackendDataMock.mockResolvedValue({
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
