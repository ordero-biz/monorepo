'use client';

import type { TablePaginationProps } from '@ordero/ui';
import type { PageMetadata } from '@/lib/server/types';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { usePaginationSearchParams } from './usePaginationSearchParams';

type UseTablePaginationArgs = {
  pageMetadata?: PageMetadata;
  paginationInput?: PaginationSearchInput;
};

type UseTablePaginationResult = Pick<
  TablePaginationProps,
  'count' | 'onPageChange' | 'onRowsPerPageChange' | 'page' | 'rowsPerPage'
>;

export const useTablePagination = ({
  pageMetadata,
  paginationInput,
}: UseTablePaginationArgs): UseTablePaginationResult => {
  const { page, setPagination, size } = usePaginationSearchParams({
    paginationInput,
  });

  return {
    count: pageMetadata?.totalElements ?? 0,
    onPageChange: (nextPage) => {
      setPagination({
        page: nextPage,
        size,
      });
    },
    onRowsPerPageChange: (nextRowsPerPage) => {
      setPagination({
        page: 0,
        size: nextRowsPerPage,
      });
    },
    page,
    rowsPerPage: size,
  };
};
