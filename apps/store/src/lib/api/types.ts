import type { AuthSession as SharedAuthSession } from '@ordero/api-types';

export type AuthUser = {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
};

export type AuthSession = SharedAuthSession<AuthUser>;

export type AuthSignInInput = {
  email: string;
  password: string;
};

export type { ApiError, ApiResult, Token } from '@ordero/api-types';
