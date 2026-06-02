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
