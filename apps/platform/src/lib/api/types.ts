export type Token = string;

export type AuthUser = {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
};

export type AuthSession =
  | {
      authenticated: true;
      user?: AuthUser;
    }
  | {
      authenticated: false;
    };

export type AuthSignInInput = {
  email: string;
  password: string;
};

export type AuthSignUpInput = {
  email: string;
  password: string;
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
