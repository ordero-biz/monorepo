'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePaginationSearchParams } from '@/lib/hooks/usePaginationSearchParams';
import type { PaginationSearchInput } from '@/lib/utils/url';
import {
  getProductsListMode,
  PRODUCTS_LIST_MODE_SEARCH_PARAM,
} from '../constants';
import type { ProductsListMode } from '../types';

type UseProductsListModeArgs = {
  paginationInput?: PaginationSearchInput;
};

export const useProductsListMode = ({
  paginationInput,
}: UseProductsListModeArgs) => {
  const searchParams = useSearchParams();
  const searchParamsListMode = getProductsListMode(
    searchParams.get(PRODUCTS_LIST_MODE_SEARCH_PARAM)
  );
  const [listMode, setListModeState] = useState(searchParamsListMode);
  const { paginationInput: currentPaginationInput, resetPagination } =
    usePaginationSearchParams({ paginationInput });

  useEffect(() => {
    setListModeState(searchParamsListMode);
  }, [searchParamsListMode]);

  const setListMode = (nextListMode: ProductsListMode) => {
    setListModeState(nextListMode);
    resetPagination({
      updateSearchParams: (nextSearchParams) => {
        nextSearchParams.set(PRODUCTS_LIST_MODE_SEARCH_PARAM, nextListMode);
      },
    });
  };

  return {
    listMode,
    paginationInput: currentPaginationInput,
    setListMode,
  };
};
