import { describe, expect, it, vi } from 'vitest';
import { resolveServerSession } from './session';

describe('resolveServerSession', () => {
  it('returns a signed-out session when there is no token', async () => {
    const fetchBackendData = vi.fn();

    await expect(
      resolveServerSession({
        mePath: '/me',
        fetchBackendData,
      })
    ).resolves.toStrictEqual({
      ok: true,
      session: {
        authenticated: false,
      },
      shouldClearAuthCookie: false,
    });
    expect(fetchBackendData).not.toHaveBeenCalled();
  });

  it('returns an authenticated session when the backend accepts the token', async () => {
    const fetchBackendData = vi.fn().mockResolvedValue({
      ok: true,
      data: {
        email: 'admin@gmail.com',
      },
    });

    await expect(
      resolveServerSession({
        token: 'jwt-token',
        mePath: '/me',
        fetchBackendData,
      })
    ).resolves.toStrictEqual({
      ok: true,
      session: {
        authenticated: true,
        user: {
          email: 'admin@gmail.com',
        },
      },
      shouldClearAuthCookie: false,
    });
    expect(fetchBackendData).toHaveBeenCalledWith({
      path: '/me',
      init: {
        method: 'GET',
      },
      token: 'jwt-token',
    });
  });

  it('returns a signed-out session and marks the cookie for clearing on 401', async () => {
    const fetchBackendData = vi.fn().mockResolvedValue({
      ok: false,
      error: {
        status: 401,
        message: 'Unauthorized',
      },
    });

    await expect(
      resolveServerSession({
        token: 'stale-token',
        mePath: '/me',
        fetchBackendData,
      })
    ).resolves.toStrictEqual({
      ok: true,
      session: {
        authenticated: false,
      },
      shouldClearAuthCookie: true,
    });
  });

  it('returns non-auth backend errors unchanged', async () => {
    const fetchBackendData = vi.fn().mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Backend unavailable',
      },
    });

    await expect(
      resolveServerSession({
        token: 'jwt-token',
        mePath: '/me',
        fetchBackendData,
      })
    ).resolves.toStrictEqual({
      ok: false,
      error: {
        status: 500,
        message: 'Backend unavailable',
      },
      shouldClearAuthCookie: false,
    });
  });
});
