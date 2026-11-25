export type Token = string;

export type AuthSession<TUser = unknown> =
  | {
      authenticated: true;
      user?: TUser;
    }
  | {
      authenticated: false;
    };

export type ApiError = {
  status: number;
  message: string;
  code?: string;
  fieldErrors?: Record<string, string>;
};

export type ApiResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: ApiError;
    };
