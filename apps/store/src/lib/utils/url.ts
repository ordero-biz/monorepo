export type PaginationSearchInput = {
  page?: number;
  size?: number;
  sort?: string[];
};

export type SearchParamsInput = Record<string, string | string[] | undefined>;

type SearchParamsLike =
  | SearchParamsInput
  | Pick<URLSearchParams, 'get' | 'getAll'>;

export const DEFAULT_PAGE = {
  page: 0,
  size: 5,
} as const;

const hasUrlSearchParamsApi = (
  searchParams: SearchParamsLike
): searchParams is Pick<URLSearchParams, 'get' | 'getAll'> =>
  typeof (searchParams as Pick<URLSearchParams, 'get' | 'getAll'>).getAll ===
  'function';

const getSearchParamValues = (searchParams: SearchParamsLike, key: string) => {
  if (hasUrlSearchParamsApi(searchParams)) {
    return searchParams.getAll(key);
  }

  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value;
  }

  return value === undefined ? [] : [value];
};

const getIntegerSearchParam = (
  searchParams: SearchParamsLike,
  key: string,
  min: number
) => {
  const [value] = getSearchParamValues(searchParams, key);
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue >= min
    ? parsedValue
    : undefined;
};

export const getPaginationSearchInput = (
  searchParams: SearchParamsLike = {}
): PaginationSearchInput => {
  const sort = getSearchParamValues(searchParams, 'sort').filter(Boolean);

  return {
    page: getIntegerSearchParam(searchParams, 'page', 0) ?? DEFAULT_PAGE.page,
    size: getIntegerSearchParam(searchParams, 'size', 1) ?? DEFAULT_PAGE.size,
    ...(sort.length > 0 ? { sort } : {}),
  };
};

export const getPaginationSearch = ({
  page = DEFAULT_PAGE.page,
  size = DEFAULT_PAGE.size,
  sort,
}: PaginationSearchInput = {}) => {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  sort?.forEach((sortValue) => {
    searchParams.append('sort', sortValue);
  });

  return searchParams.toString();
};
