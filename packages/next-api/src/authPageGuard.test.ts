import { cookies } from 'next/headers';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { hasAuthenticatedServerSession } from './authPageGuard';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

const cookiesMock = vi.mocked(cookies);

describe('hasAuthenticatedServerSession', () => {
  beforeEach(() => {
    cookiesMock.mockReset();
  });

  it('returns false when the auth cookie is missing', async () => {
    const getServerSession = vi.fn().mockResolvedValue({
      ok: true,
      session: {
        authenticated: false,
      },
      shouldClearAuthCookie: false,
    });

    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue(undefined),
    } as never);

    await expect(
      hasAuthenticatedServerSession({
        getServerSession,
      })
    ).resolves.toBe(false);
    expect(getServerSession).toHaveBeenCalledWith(undefined);
  });

  it('returns true when the shared session lookup is authenticated', async () => {
    const getServerSession = vi.fn().mockResolvedValue({
      ok: true,
      session: {
        authenticated: true,
        user: {
          email: 'admin@gmail.com',
        },
      },
      shouldClearAuthCookie: false,
    });

    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({
        value: 'jwt-token',
      }),
    } as never);

    await expect(
      hasAuthenticatedServerSession({
        getServerSession,
      })
    ).resolves.toBe(true);
    expect(getServerSession).toHaveBeenCalledWith('jwt-token');
  });

  it('uses custom cookie names when provided', async () => {
    const getServerSession = vi.fn().mockResolvedValue({
      ok: true,
      session: {
        authenticated: true,
      },
      shouldClearAuthCookie: false,
    });
    const getCookie = vi.fn().mockReturnValue({
      value: 'custom-token',
    });

    cookiesMock.mockResolvedValue({
      get: getCookie,
    } as never);

    await expect(
      hasAuthenticatedServerSession({
        cookieName: 'custom_auth',
        getServerSession,
      })
    ).resolves.toBe(true);
    expect(getCookie).toHaveBeenCalledWith('custom_auth');
    expect(getServerSession).toHaveBeenCalledWith('custom-token');
  });

  it('returns false for failed or signed-out session lookups', async () => {
    const getServerSession = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        session: {
          authenticated: false,
        },
        shouldClearAuthCookie: true,
      })
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 500,
          message: 'Backend unavailable',
        },
        shouldClearAuthCookie: false,
      });

    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({
        value: 'jwt-token',
      }),
    } as never);

    await expect(
      hasAuthenticatedServerSession({
        getServerSession,
      })
    ).resolves.toBe(false);
    await expect(
      hasAuthenticatedServerSession({
        getServerSession,
      })
    ).resolves.toBe(false);
  });
});
