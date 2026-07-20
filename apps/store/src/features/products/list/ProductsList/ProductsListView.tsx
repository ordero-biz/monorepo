'use client';

import { useState } from 'react';
import { PRODUCTS_LIST_MODE } from './constants';
import { ProductsList } from './ProductsList';
import { ProductsListHeader } from './ProductsListHeader';
import type { ProductsListMode, ProductsListViewProps } from './types';

export const ProductsListView = ({
  paginationInput,
}: ProductsListViewProps) => {
  const [listMode, setListMode] = useState<ProductsListMode>(
    PRODUCTS_LIST_MODE.products
  );

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <ProductsListHeader listMode={listMode} onListModeChange={setListMode} />
      <ProductsList listMode={listMode} paginationInput={paginationInput} />
    </div>
  );
};
