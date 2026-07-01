export type Warehouse = {
  id: number;
  code: string;
  name: string;
  address: string;
  comment: string;
};

export type GetWarehousesInput = {
  page?: number;
  size?: number;
  sort?: string[];
};

const DEFAULT_WAREHOUSES_PAGE = {
  page: 0,
  size: 25,
} as const;

export const getWarehousesSearch = ({
  page = DEFAULT_WAREHOUSES_PAGE.page,
  size = DEFAULT_WAREHOUSES_PAGE.size,
  sort,
}: GetWarehousesInput = {}) => {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  sort?.forEach((sortValue) => {
    searchParams.append('sort', sortValue);
  });

  return searchParams.toString();
};
