import { BACKEND_AUTH_PATHS } from '@/lib/api/constants';
import { backendFetch } from '@/lib/api/server';
import type { ApiError, AuthSession, AuthUser } from '@/lib/api/types';

export type ServerSessionResult =
  | {
      ok: true;
      session: AuthSession;
      shouldClearAuthCookie: boolean;
    }
  | {
      ok: false;
      error: ApiError;
      shouldClearAuthCookie: false;
    };

export const getServerSession = async (
  token?: string
): Promise<ServerSessionResult> => {
  if (!token) {
    return {
      ok: true,
      session: { authenticated: false },
      shouldClearAuthCookie: false,
    };
  }

  const result = await backendFetch<AuthUser>({
    path: BACKEND_AUTH_PATHS.me,
    init: {
      method: 'GET',
    },
    token,
  });

  if (!result.ok) {
    if (result.error.status === 401) {
      return {
        ok: true,
        session: { authenticated: false },
        shouldClearAuthCookie: true,
      };
    }

    return {
      ok: false,
      error: result.error,
      shouldClearAuthCookie: false,
    };
  }

  return {
    ok: true,
    session: {
      authenticated: true,
      user: result.data,
    },
    shouldClearAuthCookie: false,
  };
};
