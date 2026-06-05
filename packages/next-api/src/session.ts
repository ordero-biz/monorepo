import type {
  ApiError,
  ApiResult,
  AuthSession,
  Token,
} from '@ordero/api-types';

export type ServerSessionResult<TUser = unknown> =
  | {
      ok: true;
      session: AuthSession<TUser>;
      shouldClearAuthCookie: boolean;
    }
  | {
      ok: false;
      error: ApiError;
      shouldClearAuthCookie: false;
    };

export type FetchBackendData = <T>(args: {
  path: string;
  init?: RequestInit;
  token?: Token;
  search?: string;
}) => Promise<ApiResult<T>>;

export type ResolveServerSessionArgs = {
  token?: Token;
  mePath: string;
  fetchBackendData: FetchBackendData;
};

export const resolveServerSession = async <TUser = unknown>({
  token,
  mePath,
  fetchBackendData,
}: ResolveServerSessionArgs): Promise<ServerSessionResult<TUser>> => {
  if (!token) {
    return {
      ok: true,
      session: { authenticated: false },
      shouldClearAuthCookie: false,
    };
  }

  const result = await fetchBackendData<TUser>({
    path: mePath,
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
