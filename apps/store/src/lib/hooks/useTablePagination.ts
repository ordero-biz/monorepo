'use client';

import type { TablePaginationProps } from '@ordero/ui';
import { useEffect } from 'react';
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

  useEffect(() => {
    // A navigation can update the URL before the matching response arrives.
    if (
      !pageMetadata ||
      pageMetadata.number !== page - 1 ||
      pageMetadata.size !== size
    ) {
      return;
    }

    const lastPage = Math.max(1, pageMetadata.totalPages);

    if (page > lastPage) {
      setPagination({ page: lastPage, replace: true, size });
    }
  }, [page, pageMetadata, setPagination, size]);

  return getTablePagination({
    pageMetadata,
    pagination: {
      page,
      setPagination,
      size,
    },
  });
};
