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
  navigationType?: 'push' | 'replace';
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
> & {
  correctPage: (pageMetadata?: PageMetadata) => void;
};

type GetTablePaginationArgs = {
  pageMetadata?: PageMetadata;
  pagination: TablePaginationController;
};

export const getTablePagination = ({
  pageMetadata,
  pagination,
}: GetTablePaginationArgs): UseTablePaginationResult => ({
  correctPage: (updatedPageMetadata) => {
    if (
      !updatedPageMetadata ||
      updatedPageMetadata.number !== pagination.page - 1 ||
      updatedPageMetadata.size !== pagination.size
    ) {
      return;
    }

    const lastPage = Math.max(1, updatedPageMetadata.totalPages);

    if (pagination.page > lastPage) {
      pagination.setPagination({
        navigationType: 'replace',
        page: lastPage,
        size: pagination.size,
      });
    }
  },
  count: pageMetadata?.totalElements ?? 0,
  onPageChange: (nextPage) => {
    pagination.setPagination({
      page: nextPage + 1,
      size: pagination.size,
    });
  },
  onRowsPerPageChange: (nextRowsPerPage) => {
    pagination.setPagination({
      page: 1,
      size: nextRowsPerPage,
    });
  },
  page: Math.max(0, pagination.page - 1),
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
