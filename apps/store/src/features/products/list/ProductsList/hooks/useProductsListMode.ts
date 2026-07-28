'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ResetPagination } from '@/lib/hooks/usePaginationSearchParams';
import {
  getProductsListMode,
  PRODUCTS_LIST_MODE_SEARCH_PARAM,
} from '../constants';
import type { ProductsListMode } from '../types';

type UseProductsListModeArgs = {
  resetPagination: ResetPagination;
};

export const useProductsListMode = ({
  resetPagination,
}: UseProductsListModeArgs) => {
  const searchParams = useSearchParams();
  const searchParamsListMode = getProductsListMode(
    searchParams.get(PRODUCTS_LIST_MODE_SEARCH_PARAM)
  );
  const [listMode, setListModeState] = useState(searchParamsListMode);

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
    setListMode,
  };
};
