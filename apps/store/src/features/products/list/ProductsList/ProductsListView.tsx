'use client';

import { usePaginationSearchParams } from '@/lib/hooks/usePaginationSearchParams';
import { useProductsListMode } from './hooks/useProductsListMode';
import { ProductsList } from './ProductsList';
import { ProductsListHeader } from './ProductsListHeader';
import type { ProductsListViewProps } from './types';

export const ProductsListView = ({
  paginationInput,
}: ProductsListViewProps) => {
  const {
    page,
    paginationInput: currentPaginationInput,
    resetPagination,
    setPagination,
    size,
  } = usePaginationSearchParams({ paginationInput });

  const { listMode, setListMode } = useProductsListMode({ resetPagination });

  const pagination = {
    page,
    setPagination,
    size,
  };

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <ProductsListHeader listMode={listMode} onListModeChange={setListMode} />
      <ProductsList
        listMode={listMode}
        pagination={pagination}
        paginationInput={currentPaginationInput}
      />
    </div>
  );
};
