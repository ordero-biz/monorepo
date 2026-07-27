import type { PaginationSearchInput } from '@/lib/utils/url';
import type { PRODUCTS_LIST_MODE } from './constants';

export type ProductsListMode =
  (typeof PRODUCTS_LIST_MODE)[keyof typeof PRODUCTS_LIST_MODE];

export type ProductsListFilters = {
  listMode: ProductsListMode;
};

export type ProductsListHeaderProps = {
  listMode: ProductsListMode;
  onListModeChange: (listMode: ProductsListMode) => void;
};

export type ProductsListProps = {
  listMode: ProductsListMode;
  paginationInput?: PaginationSearchInput;
};

export type ProductsListViewProps = {
  paginationInput?: PaginationSearchInput;
};
