'use client';

import { useListFilters } from '@/lib/hooks/useListFilters';
import { usePaginationSearchParams } from '@/lib/hooks/usePaginationSearchParams';
import { PRODUCTS_LIST_MODE } from './constants';
import { ProductsList } from './ProductsList';
import { ProductsListHeader } from './ProductsListHeader';
import type {
  ProductsListFilters,
  ProductsListMode,
  ProductsListViewProps,
} from './types';

export const ProductsListView = ({
  paginationInput,
}: ProductsListViewProps) => {
  const {
    paginationInput: currentPaginationInput,
    resetPagination,
  } = usePaginationSearchParams({ paginationInput });
  const { filters, setFilters } = useListFilters<ProductsListFilters>({
    initialFilters: {
      listMode: PRODUCTS_LIST_MODE.products,
    },
  });
  const handleListModeChange = (nextListMode: ProductsListMode) => {
    setFilters({
      listMode: nextListMode,
    });
    resetPagination();
  };

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <ProductsListHeader
        listMode={filters.listMode}
        onListModeChange={handleListModeChange}
      />
      <ProductsList
        listMode={filters.listMode}
        paginationInput={currentPaginationInput}
      />
    </div>
  );
};
