'use client';

import type { TablePaginationProps } from '@ordero/ui';
import type { PageMetadata } from '@/lib/server/types';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { usePaginationSearchParams } from './usePaginationSearchParams';

type UseTablePaginationArgs = {
  pageMetadata?: PageMetadata;
  paginationInput?: PaginationSearchInput;
};

type SetTablePaginationArgs = {
  page: number;
  size: number;
};

export type TablePaginationController = {
  page: number;
  setPagination: (args: SetTablePaginationArgs) => void;
  size: number;
};

type UseTablePaginationResult = Pick<
  TablePaginationProps,
  'count' | 'onPageChange' | 'onRowsPerPageChange' | 'page' | 'rowsPerPage'
>;

type GetTablePaginationArgs = {
  pageMetadata?: PageMetadata;
  pagination: TablePaginationController;
};

export const getTablePagination = ({
  pageMetadata,
  pagination,
}: GetTablePaginationArgs): UseTablePaginationResult => ({
  count: pageMetadata?.totalElements ?? 0,
  onPageChange: (nextPage) => {
    pagination.setPagination({
      page: nextPage,
      size: pagination.size,
    });
  },
  onRowsPerPageChange: (nextRowsPerPage) => {
    pagination.setPagination({
      page: 0,
      size: nextRowsPerPage,
    });
  },
  page: pagination.page,
  rowsPerPage: pagination.size,
});

export const useTablePagination = ({
  pageMetadata,
  paginationInput,
}: UseTablePaginationArgs): UseTablePaginationResult => {
  const { page, setPagination, size } = usePaginationSearchParams({
    paginationInput,
  });

  return getTablePagination({
    pageMetadata,
    pagination: {
      page,
      setPagination,
      size,
    },
  });
};
