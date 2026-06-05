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

export type Attribute = {
  id: number;
  name: string;
  sortOrder: number;
  values?: string[];
  createdAt: string;
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

export type AttributesListResponse = PaginatedResponse<Attribute>;
export type { ApiError, ApiResult, Token } from '@ordero/api-types';
