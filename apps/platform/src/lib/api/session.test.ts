import { fetchBackendResponse } from '@/lib/api/server';
import { getServerSession } from './session';

vi.mock('@/lib/api/server', async () => ({
  ...(await vi.importActual<typeof import('@/lib/api/server')>(
    '@/lib/api/server'
  )),
  fetchBackendResponse: vi.fn(),
}));

const fetchBackendResponseMock = vi.mocked(fetchBackendResponse);

describe('getServerSession', () => {
  beforeEach(() => {
    fetchBackendResponseMock.mockReset();
  });

  it('returns a signed-out session when there is no token', async () => {
    await expect(getServerSession()).resolves.toStrictEqual({
      ok: true,
      session: {
        authenticated: false,
      },
      shouldClearAuthCookie: false,
    });
    expect(fetchBackendResponseMock).not.toHaveBeenCalled();
  });

  it('returns an authenticated session when the backend accepts the token', async () => {
    fetchBackendResponseMock.mockResolvedValue({
      ok: true,
      data: new Response(
        JSON.stringify({
          email: 'admin@gmail.com',
        })
      ),
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
    expect(fetchBackendResponseMock).toHaveBeenCalledWith({
      path: '/me',
      init: {
        method: 'GET',
      },
      token: 'jwt-token',
    });
  });

  it('returns a signed-out session and marks the cookie for clearing on 401', async () => {
    fetchBackendResponseMock.mockResolvedValue({
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
    fetchBackendResponseMock.mockResolvedValue({
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
