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

export type AuthSignUpInput = {
  email: string;
  password: string;
};

export type CreateStoreInput = {
  name: string;
  subDomain: string;
};

export type Store = {
  id: number;
  name: string;
  subDomain: string;
};
