import { cookies } from 'next/headers';
import { getServerSession } from '@/lib/api/session';
import { hasAuthenticatedServerSession } from './authPageGuard';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('@/lib/api/session', () => ({
  getServerSession: vi.fn(),
}));

const cookiesMock = vi.mocked(cookies);
const getServerSessionMock = vi.mocked(getServerSession);

describe('authPageGuard', () => {
  beforeEach(() => {
    cookiesMock.mockReset();
    getServerSessionMock.mockReset();
  });

  it('returns false when the auth cookie is missing', async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue(undefined),
    } as never);

    getServerSessionMock.mockResolvedValue({
      ok: true,
      session: {
        authenticated: false,
      },
      shouldClearAuthCookie: false,
    });

    await expect(hasAuthenticatedServerSession()).resolves.toBe(false);
    expect(getServerSessionMock).toHaveBeenCalledWith(undefined);
  });

  it('returns true when the shared session lookup is authenticated', async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({
        value: 'jwt-token',
      }),
    } as never);
    getServerSessionMock.mockResolvedValue({
      ok: true,
      session: {
        authenticated: true,
        user: {
          email: 'admin@gmail.com',
        },
      },
      shouldClearAuthCookie: false,
    });

    await expect(hasAuthenticatedServerSession()).resolves.toBe(true);
    expect(getServerSessionMock).toHaveBeenCalledWith('jwt-token');
  });

  it('returns false when the shared session lookup is signed out', async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({
        value: 'stale-token',
      }),
    } as never);
    getServerSessionMock.mockResolvedValue({
      ok: true,
      session: {
        authenticated: false,
      },
      shouldClearAuthCookie: true,
    });

    await expect(hasAuthenticatedServerSession()).resolves.toBe(false);
  });
});
