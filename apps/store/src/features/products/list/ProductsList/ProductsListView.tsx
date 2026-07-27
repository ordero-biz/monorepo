'use client';

import { useProductsListMode } from './hooks/useProductsListMode';
import { ProductsList } from './ProductsList';
import { ProductsListHeader } from './ProductsListHeader';
import type { ProductsListViewProps } from './types';

export const ProductsListView = ({
  paginationInput,
}: ProductsListViewProps) => {
  const {
    listMode,
    paginationInput: currentPaginationInput,
    setListMode,
  } = useProductsListMode({ paginationInput });

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <ProductsListHeader listMode={listMode} onListModeChange={setListMode} />
      <ProductsList
        listMode={listMode}
        paginationInput={currentPaginationInput}
      />
    </div>
  );
};
