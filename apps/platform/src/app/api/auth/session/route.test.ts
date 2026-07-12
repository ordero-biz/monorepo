import { AUTH_TOKEN_COOKIE_NAME } from '@ordero/next-api/server';
import { NextRequest } from 'next/server';
import { getServerSession } from '@/lib/server/session';
import { GET as getSession } from './route';

const { getServerSessionMock } = vi.hoisted(() => ({
  getServerSessionMock: vi.fn(),
}));

vi.mock('@/lib/server/session', () => ({
  getServerSession: getServerSessionMock,
}));

const getServerSessionMocked = vi.mocked(getServerSession);

const getJson = async <T>(response: Response) => (await response.json()) as T;

describe('GET /api/auth/session', () => {
  beforeEach(() => {
    getServerSessionMocked.mockReset();
  });

  it('returns a signed-out session without a token', async () => {
    getServerSessionMocked.mockResolvedValue({
      ok: true,
      session: {
        authenticated: false,
      },
      shouldClearAuthCookie: false,
    });
    const response = await getSession(
      new NextRequest('http://localhost/api/auth/session')
    );

    await expect(getJson(response)).resolves.toStrictEqual({
      authenticated: false,
    });
    expect(getServerSessionMocked).toHaveBeenCalledWith(undefined);
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it('returns an authenticated session when the server session resolves', async () => {
    getServerSessionMocked.mockResolvedValue({
      ok: true,
      session: {
        authenticated: true,
        user: {
          email: 'admin@gmail.com',
        },
      },
      shouldClearAuthCookie: false,
    });
    const response = await getSession(
      new NextRequest('http://localhost/api/auth/session', {
        headers: {
          cookie: `${AUTH_TOKEN_COOKIE_NAME}=jwt-token`,
        },
      })
    );

    await expect(getJson(response)).resolves.toStrictEqual({
      authenticated: true,
      user: {
        email: 'admin@gmail.com',
      },
    });
    expect(getServerSessionMocked).toHaveBeenCalledWith('jwt-token');
  });

  it('clears the auth cookie when the server session rejects the token', async () => {
    getServerSessionMocked.mockResolvedValue({
      ok: true,
      session: {
        authenticated: false,
      },
      shouldClearAuthCookie: true,
    });
    const response = await getSession(
      new NextRequest('http://localhost/api/auth/session', {
        headers: {
          cookie: `${AUTH_TOKEN_COOKIE_NAME}=stale-token`,
        },
      })
    );

    await expect(getJson(response)).resolves.toStrictEqual({
      authenticated: false,
    });
    expect(getServerSessionMocked).toHaveBeenCalledWith('stale-token');
    expect(response.headers.get('set-cookie')).toContain(
      `${AUTH_TOKEN_COOKIE_NAME}=`
    );
    expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
  });
});
