'use client';

import type { TablePaginationProps } from '@ordero/ui';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import type { PageMetadata } from '@/lib/server/types';
import {
  DEFAULT_PAGE,
  getPaginationSearchInput,
  type PaginationSearchInput,
} from '@/lib/utils/url';

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
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPaginationInput = useMemo(
    () =>
      searchParams.has('page') || searchParams.has('size')
        ? getPaginationSearchInput(searchParams)
        : (paginationInput ?? DEFAULT_PAGE),
    [paginationInput, searchParams]
  );

  const page = currentPaginationInput.page ?? DEFAULT_PAGE.page;
  const rowsPerPage = currentPaginationInput.size ?? DEFAULT_PAGE.size;

  const pushPaginationUrl = ({
    nextPage,
    nextRowsPerPage,
  }: {
    nextPage: number;
    nextRowsPerPage: number;
  }) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    nextSearchParams.set('page', String(nextPage));
    nextSearchParams.set('size', String(nextRowsPerPage));

    router.push(`${pathname}?${nextSearchParams.toString()}`, {
      scroll: false,
    });
  };

  return {
    count: pageMetadata?.totalElements ?? 0,
    onPageChange: (nextPage) => {
      pushPaginationUrl({
        nextPage,
        nextRowsPerPage: rowsPerPage,
      });
    },
    onRowsPerPageChange: (nextRowsPerPage) => {
      pushPaginationUrl({
        nextPage: DEFAULT_PAGE.page,
        nextRowsPerPage,
      });
    },
    page,
    rowsPerPage,
  };
};
