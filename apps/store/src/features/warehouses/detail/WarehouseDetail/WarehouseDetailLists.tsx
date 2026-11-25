'use client';

import { ToggleButton } from '@ordero/ui';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  getWarehouseListMode,
  WAREHOUSE_LIST_MODE,
  WAREHOUSE_LIST_MODE_SEARCH_PARAM,
} from '@/lib/domain/warehouses/constants';
import { DEFAULT_PAGE } from '@/lib/utils/url';
import type { WarehouseDetailListsProps } from './types';
import { WarehouseDetailProducts } from './WarehouseDetailProducts';
import { WarehouseDetailSupplies } from './WarehouseDetailSupplies';

export const WarehouseDetailLists = ({
  warehouseId,
  paginationInput,
}: WarehouseDetailListsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const listMode = getWarehouseListMode(
    searchParams.get(WAREHOUSE_LIST_MODE_SEARCH_PARAM)
  );

  const handleListModeChange = (value: string[]) => {
    const nextListMode = value[0];
    if (!nextListMode || nextListMode === listMode) return;

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set(WAREHOUSE_LIST_MODE_SEARCH_PARAM, nextListMode);
    nextSearchParams.set('page', String(DEFAULT_PAGE.page));
    // Stock and supplies have different sortable fields.
    nextSearchParams.delete('sort');
    router.push(`${pathname}?${nextSearchParams.toString()}`, {
      scroll: false,
    });
  };

  const headerActions = (
    <ToggleButton.Group
      aria-label="Warehouse list mode"
      onValueChange={handleListModeChange}
      orientation="horizontal"
      size="s"
      value={[listMode]}
    >
      <ToggleButton.Item value={WAREHOUSE_LIST_MODE.products}>
        Products
      </ToggleButton.Item>
      <ToggleButton.Item value={WAREHOUSE_LIST_MODE.supplies}>
        Supplies
      </ToggleButton.Item>
    </ToggleButton.Group>
  );

  return listMode === WAREHOUSE_LIST_MODE.supplies ? (
    <WarehouseDetailSupplies
      warehouseId={warehouseId}
      paginationInput={paginationInput}
      headerActions={headerActions}
    />
  ) : (
    <WarehouseDetailProducts
      warehouseId={warehouseId}
      paginationInput={paginationInput}
      headerActions={headerActions}
    />
  );
};
