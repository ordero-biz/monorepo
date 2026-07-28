import type { TablePaginationController } from '@/lib/hooks/useTablePagination';
import type { PaginationSearchInput } from '@/lib/utils/url';
import type { PRODUCTS_LIST_MODE } from './constants';

export type ProductsListMode =
  (typeof PRODUCTS_LIST_MODE)[keyof typeof PRODUCTS_LIST_MODE];

export type ProductsListHeaderProps = {
  listMode: ProductsListMode;
  onListModeChange: (listMode: ProductsListMode) => void;
};

export type ProductsListProps = {
  listMode: ProductsListMode;
  pagination: TablePaginationController;
  paginationInput?: PaginationSearchInput;
};

export type ProductsListViewProps = {
  paginationInput?: PaginationSearchInput;
};
