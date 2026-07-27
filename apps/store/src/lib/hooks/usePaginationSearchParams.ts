'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_PAGE,
  getPaginationSearchInput,
  type PaginationSearchInput,
} from '@/lib/utils/url';

type SetPaginationArgs = {
  page: number;
  size: number;
  updateSearchParams?: SearchParamsUpdater;
};

type UsePaginationSearchParamsArgs = {
  paginationInput?: PaginationSearchInput;
};

type ResetPaginationArgs = {
  updateSearchParams?: SearchParamsUpdater;
};

type SearchParamsUpdater = (searchParams: URLSearchParams) => void;

export const usePaginationSearchParams = ({
  paginationInput,
}: UsePaginationSearchParamsArgs) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchPaginationInput = useMemo(
    () =>
      searchParams.has('page') || searchParams.has('size')
        ? getPaginationSearchInput(searchParams)
        : (paginationInput ?? DEFAULT_PAGE),
    [paginationInput, searchParams]
  );
  const [pendingPaginationInput, setPendingPaginationInput] = useState<
    PaginationSearchInput | undefined
  >();
  const currentPaginationInput =
    pendingPaginationInput ?? searchPaginationInput;
  const page = currentPaginationInput.page ?? DEFAULT_PAGE.page;
  const size = currentPaginationInput.size ?? DEFAULT_PAGE.size;
  const pushSearchParams = (nextSearchParams: URLSearchParams) => {
    router.push(`${pathname}?${nextSearchParams.toString()}`, {
      scroll: false,
    });
  };
  const setPagination = ({
    page: nextPage,
    size: nextSize,
    updateSearchParams,
  }: SetPaginationArgs) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    updateSearchParams?.(nextSearchParams);
    setPendingPaginationInput({
      ...currentPaginationInput,
      page: nextPage,
      size: nextSize,
    });
    nextSearchParams.set('page', String(nextPage));
    nextSearchParams.set('size', String(nextSize));
    pushSearchParams(nextSearchParams);
  };

  useEffect(() => {
    if (
      pendingPaginationInput?.page === searchPaginationInput.page &&
      pendingPaginationInput?.size === searchPaginationInput.size
    ) {
      setPendingPaginationInput(undefined);
    }
  }, [pendingPaginationInput, searchPaginationInput]);

  const resetPagination = ({
    updateSearchParams,
  }: ResetPaginationArgs = {}) => {
    if (page === DEFAULT_PAGE.page) {
      if (updateSearchParams) {
        const nextSearchParams = new URLSearchParams(searchParams.toString());

        updateSearchParams(nextSearchParams);
        pushSearchParams(nextSearchParams);
      }

      return;
    }

    setPagination({
      page: DEFAULT_PAGE.page,
      size,
      updateSearchParams,
    });
  };

  return {
    page,
    paginationInput: currentPaginationInput,
    resetPagination,
    setPagination,
    size,
  };
};
