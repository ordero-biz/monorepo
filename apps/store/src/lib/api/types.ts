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

export type PageMetadata = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  content: T[];
  page: PageMetadata;
};

export type { ApiError, ApiResult, Token } from '@ordero/api-types';
