import type {
  ApiError,
  ApiResult,
  AuthSession,
  Token,
} from '@ordero/api-types';
import { parseBackendResponseData } from './server';

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

export type FetchBackendResponse = (args: {
  path: string;
  init?: RequestInit;
  token?: Token;
  search?: string;
}) => Promise<ApiResult<Response>>;

export type ResolveServerSessionArgs = {
  token?: Token;
  mePath: string;
  fetchBackendResponse: FetchBackendResponse;
};

export const resolveServerSession = async <TUser = unknown>({
  token,
  mePath,
  fetchBackendResponse,
}: ResolveServerSessionArgs): Promise<ServerSessionResult<TUser>> => {
  if (!token) {
    return {
      ok: true,
      session: { authenticated: false },
      shouldClearAuthCookie: false,
    };
  }

  const result = await fetchBackendResponse({
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
      user: await parseBackendResponseData<TUser>(result.data),
    },
    shouldClearAuthCookie: false,
  };
};
